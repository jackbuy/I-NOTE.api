import Follow from '../model/follow';
import { updateFollowCount, updateFansCount } from './user';
import { messageSave } from './message';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

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
    const query: any = { type, userId };
    const select: string = '-__v';
    const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
    const querylimit: number = parseInt(pageSize);

    Follow.followQueryLimit({ query, select, querySkip, querylimit }).then((resp: any) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 粉丝列表
export const fansQuery  = (req: any, res: any) => {
    const { userId, type, currentPage, pageSize } = req.body;
    const query: any = {
        followId: userId,
        type
    };
    const select: string = '-__v';
    const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
    const querylimit: number = parseInt(pageSize);

    const p1 = Follow.fansQueryLimit({ query, select, querySkip, querylimit });
    const p2 = Follow.find({ query: { userId } });

    Promise.all([ p1, p2 ]).then((resp) => {
        let result: any = [];
        result = setVal(resp[0], resp[1], 'isFollow');
        SuccessMsg(res, { data: result });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 关注(人、专题、标签)
export const follow = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { followId, type } = req.body;
    const query: any = {
        userId,
        followId,
        type
    };

    Follow.findOne({ query }).then((resp: any) => {
        if (!resp) {
            Follow.save({ userId, followId, type, createTime: Date.now()}).then(() => {
                return updateFollowCount(userId);
            }).then(() => {
                return updateFansCount(userId);
            }).then(() => {
                if (parseInt(type) === 0) return messageSave({ relativeId: followId, createUserId: userId, receiveUserId: followId, type: 3 });
                Promise.resolve();
            }).then(() => {
                SuccessMsg(res, { msg: '关注成功！' });
            }).catch(() => {
                ErrorMsg(res, {});
            });
        } else {
            Follow.removeOne({ userId, followId }).then(() => {
                return updateFollowCount(userId);
            }).then(() => {
                return updateFansCount(userId);
            }).then(() => {
                SuccessMsg(res, { msg: '取消关注成功！' });
            }).catch(() => {
                ErrorMsg(res, {});
            });
        }
    }).catch(() => {
        ErrorMsg(res, {});
    });
}
