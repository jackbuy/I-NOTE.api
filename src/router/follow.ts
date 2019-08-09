import Follow from '../model/follow';
import { SuccessMsg, ErrorMsg, } from '../utils/utils';

const setVal = (arr1: any, arr2: any, type: string) => {
    let arr: any = [];
    arr1.map((item: any) => {
        arr2.map((item2: any) => {
            if (item.userId._id == item2.followId && item.followId == item2.followId) item[type] = true;
        });
        arr.push(item);
    });
    return arr;
}

/**
 * 关注列表
 * @param type 关注类型 0（关注人）、1（关注专题）、2（关注标签）
 * @param userId 
 */
export const followQuery  = (req: any, res: any) => {
    const { userId, type, currentPage, pageSize } = req.body;
    const query = { type, userId };
    const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
    const querylimit: number = parseInt(pageSize);

    Follow.followQueryLimit({ query, querySkip, querylimit }).then((resp: any) => {
        SuccessMsg(res, { data: resp });
    });
}

// 粉丝列表
export const fansQuery  = (req: any, res: any) => {
    const { userId, type, currentPage, pageSize } = req.body;
    const query = {
        followId: userId,
        type
    };
    const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
    const querylimit: number = parseInt(pageSize);

    const p1 = Follow.fansQueryLimit({ query, querySkip, querylimit });
    const p2 = Follow.find({ query: { userId } });

    Promise.all([ p1, p2 ]).then((resp) => {
        let result: any = [];
        result = setVal(resp[0], resp[1], 'isFollow');
        SuccessMsg(res, { data: result });
    });
}

// 关注(人、专题、标签)
export const follow = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { followId, type } = req.body;

    Follow.findOne({ query: { userId, followId, type } }).then((resp: any) => {
        if (!resp) {
            Follow.save({ userId, followId, type, createTime: Date.now()}).then(() => {
                SuccessMsg(res, { msg: '关注成功！' });
            });
        } else {
            Follow.removeOne({ userId, followId }).then(() => {
                SuccessMsg(res, { msg: '取消关注成功！' });
            });
        }
    });
}
