import { Tag, Follow } from '../model';
import Utils from '../utils/utils';
import { updateTagArticleCount } from './common';
const { SuccessMsg, ErrorMsg, setArr } = Utils;


// tag列表
export const tagQueryAll  = (req: any, res: any) => {
    const { currentPage, pageSize } = req.body;
    let userId: string = '';
    if (req.userMsg) userId = req.userMsg.userId;
    const query: any = {};
    const FollowQuery = { userId, type: 2 };
    const p1 = Tag.queryListLimit({ query, currentPage, pageSize });
    const p2 = Follow.find({ query: FollowQuery });

    p1.then((resp: any) => {
        let promises: object[] = resp.map((item: any) => {
            return updateTagArticleCount(item._id)
        })
        return Promise.all(promises);
    }).then(() => {
        if (userId) {
            Promise.all([p1, p2]).then((resp) => {
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

// tag推荐
export const tagRecommend = (req: any, res: any) => {
    const query: any = {};
    const currentPage: string = '1';
    const pageSize: string = '5';
    const querySort: any = { articleCount: -1 };
    const p1 = Tag.queryListLimit({ query, currentPage, pageSize, querySort });

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
        if (resp) result = resp;
        return userId ? Follow.findOne({ query: { userId, followTagId: tagId } }) : Promise.resolve(null);
    }).then((resp2: any) => {
        if (resp2) result.isFollow = true;
        SuccessMsg(res, { data: result });
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
    Tag.save({ data }).then(() => {
        SuccessMsg(res, {});
    }).catch(() => {
        ErrorMsg(res, {});
    });
}