import { Follow, Topic } from '../model';
import { updateTopicCount } from './common';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

// Topic列表
export const topicQuery  = (req: any, res: any) => {
    const { keyword, currentPage, pageSize } = req.body;
    const query: any = { };
    if (keyword) {
        const reg = new RegExp(keyword, 'i') //不区分大小写
        query.$or = [ //多条件，数组
            { title: { $regex: reg } },
            { contentText: { $regex: reg } }
        ]
    }
    const p1 = Topic.queryListLimit({ query, currentPage, pageSize });

    p1.then((resp: any) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 我的专题
export const topicUserQuery  = (req: any, res: any) => {
    const { userId, currentPage, pageSize } = req.body;
    const query: any = { userId };
    const p1 = Topic.queryListLimit({ query, currentPage, pageSize });

    p1.then((resp: any) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 推荐
export const topicRecommend = (req: any, res: any) => {
    const query: any = {};
    const currentPage: string = '1';
    const pageSize: string = '5';
    const p1 = Topic.queryListLimit({ query, currentPage, pageSize });

    p1.then((resp) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 专题详情
export const topicDetail = (req: any, res: any) => {
    const { topicId } = req.body;
    const query = { _id: topicId };
    let userId: string = '';
    let result: any = {};
    if (req.userMsg) userId = req.userMsg.userId;

    Topic.queryTopicDetail({ query }).then((resp: any) => {
        if (resp) result = resp;
        return userId ? Follow.findOne({ query: { userId, followTopicId: topicId } }) : Promise.resolve(null);
    }).then((resp: any) => {
        if (resp) result.isFollow = true;
        SuccessMsg(res, { data: result });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 专题相关文章
export const topicArticlesQuery = (req: any, res: any) => {
    const { topicId, pageSize, currentPage } = req.body;
    const query: any = { _id: topicId };
    const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
    const querylimit: number = parseInt(pageSize);
    Topic.findOne({ query }).then((resp: any) => {
        if (!resp.articleIds) return new Promise((resolve, reject) => {
            resolve([]);
        });
        let idArr: string[] = resp.articleIds.split(',').slice(querySkip, querylimit);
        let promises: object[] = idArr.map((item: any) => {
            const query: any = { _id: item };
            return Topic.queryTopicArticle({ query })
        })
        return Promise.all(promises);
    }).then((resp: any) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 新增
export const topicAdd  = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const data: any = {
        ...req.body,
        userId,
        createTime: Date.now()
    };
    let result: any = {};

    Topic.save({ data }).then((resp: any) => {
        result = resp;
        return updateTopicCount(userId);
    }).then(() => {
        SuccessMsg(res, { data: { topicId: result._id } });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 编辑
export const topicEdit  = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { topicId } = req.params;
    const update: any = {
        ...req.body,
        userId,
        editTime: Date.now()
    };
    const query: any = { _id: topicId };
    
    Topic.updateOne({ query, update }).then(() => {
        return updateTopicCount(userId);
    }).then(() => {
        SuccessMsg(res, {});
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 删除
export const topicDelete  = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { topicId } = req.params;
    const query = { _id: topicId };
    Topic.removeOne({ query }).then((resp: any) => {
        return updateTopicCount(userId);
    }).then(() => {
        SuccessMsg(res, {});
    }).catch(() => {
        ErrorMsg(res, {});
    });
}