import { TopicArticle, Like, Collect } from '../model';
import Utils from '../utils/utils';
import {
    updateTopicArticleCount
} from './common';
const { SuccessMsg, ErrorMsg } = Utils;

// 查询
export const topicArticleQuery = (req: any, res: any) => {
    const { topicId, currentPage, pageSize } = req.body;
    const query: any = {
        topicId
    }

    const topicArticleQuery = TopicArticle.topicArticleQueryLimit({ query, currentPage, pageSize });

    topicArticleQuery.then((resp) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 新增
export const topicArticleAdd = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { topicId, articleId, articleTitle } = req.body
    const data: any = {
        topicId,
        articleId,
        articleTitle,
        createUserId: userId,
        createTime: Date.now()
    }

    TopicArticle.save({ data }).then(() => {
        return updateTopicArticleCount(topicId);
    }).then(() => {
        SuccessMsg(res, {});
    }).catch(() => {
        ErrorMsg(res, {});
    })
}

// 删除
export const topicArticleDelete = (req: any, res: any) => {
    const { topicId, topicArticleId } = req.params;
    const query: any = {
        _id: topicArticleId
    }

    TopicArticle.removeOne({ query }).then(() => {
        return updateTopicArticleCount(topicId);
    }).then(() => {
        SuccessMsg(res, {});
    }).catch(() => {
        ErrorMsg(res, {});
    });
}