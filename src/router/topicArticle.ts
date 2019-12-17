import { TopicArticle } from '../model';
import Utils from '../utils/utils';
import {
    updateTopicArticleCount
} from './common';
const { SuccessMsg, ErrorMsg } = Utils;

// 查询
export const topicArticleQuery = async (req: any, res: any) => {
    const { topicId, currentPage, pageSize } = req.body;
    const query: any = {
        topicId
    };

    try {
        const result: any = await TopicArticle.topicArticleQueryLimit({ query, currentPage, pageSize });
        SuccessMsg(res, { data: result });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 新增
export const topicArticleAdd = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { topicId, articleId } = req.body
    const data: any = {
        topicId,
        articleId,
        createUserId: userId,
        createTime: Date.now()
    }

    try {
        await TopicArticle.save({ data });
        await updateTopicArticleCount(topicId);
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 删除
export const topicArticleDelete = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { topicId, articleId } = req.params;
    const query: any = {
        topicId,
        articleId,
        createUserId: userId
    }

    try {
        await TopicArticle.removeOne({ query });
        await updateTopicArticleCount(topicId);
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
}