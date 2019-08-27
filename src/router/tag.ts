import Follow from '../model/follow';
import Tag from '../model/tag';
import Utils from '../utils/utils';
import { updateTagArticleCount } from './user';
const { SuccessMsg, ErrorMsg, setArr } = Utils;


// tag列表
export const tagQueryAll  = (req: any, res: any) => {
    let userId: string = '';
    if (req.userMsg) userId = req.userMsg.userId;
    const query = { type: 2 , userId };
    const p1 = Tag.find({});
    const p2 = Follow.find({ query });

    p1.then((resp: any) => {
        let promises: object[] = resp.map((item: any) => {
            return updateTagArticleCount(item._id)
        })
        return Promise.all(promises);
    }).then(() => {
        if (userId) {
            Promise.all([p1, p2]).then((resp) => {
                const result = setArr({ arr1: resp[0], arr2: resp[1], t: 'isFollow', op1: '_id', op2: 'followId' });
                SuccessMsg(res, { data: result});
            });
        } else {
            p1.then((resp) => { SuccessMsg(res, { data: resp }); })
        }
    });
}

// 已关注tag列表
export const tagFollowQuery = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const p1 = Follow.followPopulateQuery({ type: 2, userId });
    const p2 = Tag.find({ });

    Promise.all([p1, p2]).then((resp) => {
        let result: any = setArr({ arr1: resp[0], arr2: resp[1], t:'isFollow', op1: 'followId._id', op2: '_id' });
        SuccessMsg(res, { data: result.map((item: any) => item.followId) });
    });
}

// tag推荐
export const tagRecommend = (req: any, res: any) => {
    const query: any = {};
    const select: string = '-__v';
    const querySkip: number = 0;
    const querylimit: number = 12;
    const p1 = Tag.tagRecommend({ query, select, querySkip, querylimit });

    p1.then((resp) => { SuccessMsg(res, { data: resp }); })
}
