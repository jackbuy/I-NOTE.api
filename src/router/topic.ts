import { Follow, Topic, TopicArticle } from '../model';
import { updateTopicCount } from './common';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

// 列表
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
    const topicQuery = Topic.queryListLimit({ query, currentPage, pageSize });

    topicQuery.then((resp: any) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 我的专题
export const topicUserQuery  = (req: any, res: any) => {
    const { userId, currentPage, pageSize } = req.body;
    const query: any = { userId };
    const topicQuery = Topic.queryListLimit({ query, currentPage, pageSize });

    topicQuery.then((resp: any) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 我的专题列表（返回是否已加入专题）
export const topicUserList  = (req: any, res: any) => {
    const { articleId, currentPage, pageSize } = req.body;
    const { userId } = req.userMsg;
    const query: any = { userId };
    const topicQuery = Topic.queryListLimit({ query, currentPage, pageSize });
    let topicIds: Array<string>;
    let topics: Array<object>;

    topicQuery.then((resp: any) => {
        if (resp) topics = resp;
        return TopicArticle.find({ query: { createUserId: userId, articleId } })
    }).then((resp: any) => {
        if (resp) topicIds = resp.map((item: any) => item.topicId );
        topics.map((item: any) => {
            topicIds.map((id) => {
                if (item._id.equals(id)) item.isTopic = true;
            });
        });
        SuccessMsg(res, { data: topics });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 推荐
export const topicRecommend = (req: any, res: any) => {
    const query: any = {};
    const currentPage: string = '1';
    const pageSize: string = '3';
    const topicQuery = Topic.queryListLimit({ query, currentPage, pageSize });

    topicQuery.then((resp) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 详情
export const topicDetail = (req: any, res: any) => {
    let userId: string = '';
    let result: any = {};

    const { topicId } = req.body;
    const query: any = { _id: topicId };
    if (req.userMsg) userId = req.userMsg.userId;

    const topicDetail: any = Topic.queryTopicDetail({ query });
    const followFind: any = userId ? Follow.findOne({ query: { userId, followTopicId: topicId } }) : Promise.resolve(null);

    topicDetail.then((resp: any) => {
        if (resp) result = resp;
        return followFind;
    }).then((resp: any) => {
        if (resp) result.isFollow = true;
        SuccessMsg(res, { data: result });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 新增
export const topicAdd = (req: any, res: any) => {
    let result: any = {};

    const { userId } = req.userMsg;
    const data: any = {
        ...req.body,
        userId,
        createTime: Date.now()
    };

    const topicSave = Topic.save({ data });

    topicSave.then((resp: any) => {
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

    const topicUpdate = Topic.updateOne({ query, update });
    
    topicUpdate.then(() => {
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

    const topicRemove = Topic.removeOne({ query });
    TopicArticle.count({ query: { topicId }}).then((resp: any) => {
        const count: number = resp;
        if (count > 0) return ErrorMsg(res, { msg: '专题已关联文章，不能删除！' });
        topicRemove.then((resp: any) => {
            return updateTopicCount(userId);
        }).then(() => {
            SuccessMsg(res, {});
        }).catch(() => {
            ErrorMsg(res, {});
        });
    });
}