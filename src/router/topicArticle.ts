import { TopicArticle } from '../model';
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
    };

    const topicArticleQuery = TopicArticle.topicArticleQueryLimit({ query, currentPage, pageSize });

    topicArticleQuery.then((resp: any) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 新增
export const topicArticleAdd = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { topicId, articleId } = req.body
    const data: any = {
        topicId,
        articleId,
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
    const { userId } = req.userMsg;
    const { topicId, articleId } = req.params;
    const query: any = {
        topicId,
        articleId,
        createUserId: userId
    }

    TopicArticle.removeOne({ query }).then((resp) => {
        return updateTopicArticleCount(topicId);
    }).then(() => {
        SuccessMsg(res, {});
    }).catch(() => {
        ErrorMsg(res, {});
    });
}