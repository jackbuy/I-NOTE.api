import Follow from '../model/follow';
import Tag from '../model/tag';
import Utils from '../utils/utils';
import { updateTagArticleCount } from './user';
const { SuccessMsg, ErrorMsg, setArr } = Utils;


// tag列表
export const tagQueryAll  = (req: any, res: any) => {
    const { currentPage, pageSize } = req.body;
    let userId: string = '';
    if (req.userMsg) userId = req.userMsg.userId;
    const query: any = {};
    const select: string = '-__v';
    const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
    const querylimit: number = parseInt(pageSize);
    const FollowQuery = { userId };
    const p1 = Tag.queryLimit({ query, select, querySkip, querylimit });
    const p2 = Follow.find({ FollowQuery });

    p1.then((resp: any) => {
        let promises: object[] = resp.map((item: any) => {
            return updateTagArticleCount(item._id)
        })
        return Promise.all(promises);
    }).then(() => {
        if (userId) {
            Promise.all([p1, p2]).then((resp) => {
                console.log(resp[1]);
                const result = setArr({ arr1: resp[0], arr2: resp[1], t: 'isFollow', op1: '_id', op2: 'followTagId' });
                SuccessMsg(res, { data: result});
            }).catch(() => {
                ErrorMsg(res, {});
            });
        } else {
            p1.then((resp) => {
                SuccessMsg(res, { data: resp });
            }).catch(() => {
                ErrorMsg(res, {});
            });
        }
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// // 已关注tag列表
// export const tagFollowQuery = (req: any, res: any) => {
//     const { userId } = req.userMsg;
//     const p1 = Follow.followPopulateQuery({ type: 2, userId });
//     const p2 = Tag.find({ });

//     Promise.all([p1, p2]).then((resp) => {
//         let result: any = setArr({ arr1: resp[0], arr2: resp[1], t:'isFollow', op1: 'followTagId._id', op2: '_id' });
//         SuccessMsg(res, { data: result.map((item: any) => item.followId) });
//     }).catch(() => {
//         ErrorMsg(res, {});
//     });
// }

// tag推荐
export const tagRecommend = (req: any, res: any) => {
    const query: any = {};
    const select: string = '-__v';
    const querySkip: number = 0;
    const querylimit: number = 12;
    const p1 = Tag.tagRecommend({ query, select, querySkip, querylimit });

    p1.then((resp) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// tag详情
export const tagDetail = (req: any, res: any) => {
    const { tagId } = req.body;
    const query = { _id: tagId };
    const select: string = '-__v';
    let userId: string = '';
    let result: any = {};
    if (req.userMsg) userId = req.userMsg.userId;

    Tag.findOne({ query, select }).then((resp: any) => {
        if (resp) {
            result = resp;
            Follow.findOne({ query: { userId, followTagId: tagId } }).then((resp2: any) => {
                if (resp2) result.isFollow = true;
                SuccessMsg(res, { data: result });
            }).catch(() => {
                ErrorMsg(res, {});
            });
        } else {
            ErrorMsg(res, {});
        }
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 新增
export const tagAdd  = (req: any, res: any) => {
    const data: any = {
        ...req.body,
        createTime: Date.now()
    };
    Tag.save(data).then(() => {
        SuccessMsg(res, {});
    }).catch(() => {
        ErrorMsg(res, {});
    });
}