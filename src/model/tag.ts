import { Tag, Follow } from '../schema';
import { SuccessMsg, ErrorMsg } from '../utils/utils';

/**
 * tag列表
 */
export const tagQuery  = (req: any, res: any) => {
    let userId: string = '';
    if (req.userMsg) userId = req.userMsg.userId;
    const { currentPage = 1, pageSize = 8 } = req.body;
    const query = {};
    const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
    const querylimit: number = parseInt(pageSize);

    let tagAll: any = [];
    let result: any = [];
    Tag.find(query, '-__v')
        .skip(querySkip)
        .limit(querylimit)
        .then((resp: any) => {
            tagAll = resp;
            if (userId) return Follow.find({ type: 2 , userId});
            return Promise.resolve([]);
        }).then((resp: any) => {
            tagAll.map((item: any) => {
                resp.map((respItem: any) => {
                    if (item._id == respItem.followId) item.isFollow = true;
                });
                result.push(item);
            });
        }).then(() => {
            SuccessMsg(res, { data: result });
        });
}

// 已关注tag
export const tagFollowQuery = (req: any, res: any) => {
    const { userId } = req.userMsg;
    let tagFollow: any = [];
    let result: any = [];

    Follow.find({ type: 2, userId }, 'followId')
    .populate({path: 'followId', model: Tag, select: '-__v'})
    .then((resp: any) => {
        tagFollow = resp;
        return Tag.find({});
    }).then((resp: any) => {
        tagFollow.map((item: any) => {
            resp.map((respItem: any) => {
                if (item.followId._id == respItem._id) item.isFollow = true;
            });
            result.push(item);
        });
    }).then(() => {
        SuccessMsg(res, { data: result.map((item: any) => item.followId) });
    });
}