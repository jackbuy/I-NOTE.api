import { Follow, Topic, TopicArticle } from '../model';
import { updateTopicCount } from './common';
import { fileDel } from './fileManage';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

// 列表
export const topicQuery = async (req: any, res: any) => {
    const { keyword, currentPage, pageSize } = req.body;
    const query: any = { };
    if (keyword) {
        const reg = new RegExp(keyword, 'i') //不区分大小写
        query.$or = [ //多条件，数组
            { title: { $regex: reg } },
            { contentText: { $regex: reg } }
        ]
    }
    const querySort = {
        articleCount: -1,
        followCount: -1
    };

    try {
        const result: any = await Topic.queryListLimit({ query, currentPage, pageSize, querySort });
        SuccessMsg(res, { data: result });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 我的专题
export const topicUserQuery = async (req: any, res: any) => {
    const { userId, currentPage, pageSize } = req.body;
    const query: any = { userId };

    try {
        const result: any = await Topic.queryListLimit({ query, currentPage, pageSize });
        SuccessMsg(res, { data: result });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 我的专题列表（返回是否已加入专题）
export const topicUserList = async (req: any, res: any) => {
    const { articleId, currentPage, pageSize } = req.body;
    const { userId } = req.userMsg;
    const query: any = { userId };

    try {
        let topics: any = await Topic.queryListLimit({ query, currentPage, pageSize });
        let topicArticles: any = await TopicArticle.find({ query: { createUserId: userId, articleId } });
        let topicIds: any = topicArticles.map((item: any) => JSON.stringify(item.topicId));
        topics.map((item: any) => {
            item._doc.isTopic = topicIds.includes(JSON.stringify(item._id)) ? true : false;
        });
        SuccessMsg(res, { data: topics });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 推荐
export const topicRecommend = async (req: any, res: any) => {
    const query: any = {};
    const currentPage: string = '1';
    const pageSize: string = '3';
    const querySort = {
        articleCount: -1,
        followCount: -1
    };

    try {
        let result: any = await Topic.queryListLimit({ query, currentPage, pageSize, querySort });
        SuccessMsg(res, { data: result });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 详情
export const topicDetail = async (req: any, res: any) => {
    let userId: string = '';
    const { topicId } = req.body;
    const query: any = { _id: topicId };
    if (req.userMsg) userId = req.userMsg.userId;

    try {
        let result: any = await Topic.queryTopicDetail({ query });
        if (userId) {
            const isFollow: any = await Follow.findOne({ query: { userId, followTopicId: topicId } });
            result._doc.isFollow = isFollow ? true : false;
        }
        SuccessMsg(res, { data: result });
    } catch(e) {
        ErrorMsg(res, {});
    }

}

// 新增
export const topicAdd = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const data: any = {
        ...req.body,
        userId,
        createTime: Date.now()
    };

    try {
        let result: any = await Topic.save({ data });
        await updateTopicCount(userId);
        SuccessMsg(res, { data: { topicId: result._id } });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 编辑
export const topicEdit = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { topicId } = req.params;
    const update: any = {
        ...req.body,
        userId,
        editTime: Date.now()
    };
    const query: any = { _id: topicId };

    try {
        await Topic.updateOne({ query, update });
        await updateTopicCount(userId);
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 删除
export const topicDelete = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { topicId } = req.params;
    const query = { _id: topicId };

    try {
        const count: any = await TopicArticle.count({ query: { topicId }});
        if (count > 0) return ErrorMsg(res, { msg: '专题已关联文章，不能删除！' });

        await Topic.removeOne({ query });
        await updateTopicCount(userId);
        await fileDel(topicId, '1');
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
}