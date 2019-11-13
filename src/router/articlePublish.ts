/**
 * 已发布文章
 */

import { Article, ArticlePublish, Like, Collect, Follow, TopicArticle } from '../model';
import { updateArticleCount, updateCollectCount, updateTagArticleCount } from './common';
import { messageSave } from './message';
import { emit } from '../socket';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

// 列表
export const articlePublishQuery  = (req: any, res: any) => {
    const { keyword, tagId, userId, currentPage, pageSize, sortType = 'newest' } = req.body;
    let querySort: any = {};
    let query: any = {};

    if (userId) query.userId = userId;
    if (keyword) {
        const reg = new RegExp(keyword, 'i') //不区分大小写
        query.$or = [ //多条件，数组
            { title: { $regex: reg } },
            { contentHtml: { $regex: reg } }
        ]
    }

    if (tagId) query.tagId = tagId;
    if (sortType == 'newest') querySort = { publishTime: -1 }
    if (sortType == 'popular') querySort = { viewCount: -1 }

    const articleQuery = ArticlePublish.queryListLimit({ query, currentPage, pageSize, querySort });

    articleQuery.then((resp: any) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 详情
export const articlePublishDetail  = (req: any, res: any) => {
    const { articleId } = req.body;
    const query: any = {
        _id: articleId
    };
    let userId: string = '';
    let result: any = {};
    if (req.userMsg) userId = req.userMsg.userId;

    ArticlePublish.findOne({ query }).then((resp: any) => {
        return ArticlePublish.updateOne({ query, update: { viewCount: resp.viewCount + 1 } })
    }).then(() => {
        return ArticlePublish.queryDetail({ query })
    }).then((resp: any) => {
        if (resp) result = resp;
        if (userId) return Follow.findOne({ query: { userId, followUserId: resp.userId._id } });
    }).then((resp: any) => {
        result.userId._doc.isFollow = resp ? true : false;
        if (userId) return Like.findOne({ query: { createUserId: userId, articleId } });
    }).then((resp: any) => {
        result._doc.isLike = resp ? true : false;
        if (userId) return Collect.findOne({ query: { createUserId: userId, articleId } });
    }).then((resp: any) => {
        result._doc.isCollect = resp ? true : false;
        SuccessMsg(res, { data: result });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 收藏
export const articlePublishCollect = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { articleId, articleTitle } = req.body;

    const articleQuery: any = { _id: articleId };
    const collectQuery = {
        articleId,
        createUserId: userId
    };
    const data: any = {
        ...collectQuery,
        articleTitle,
        createTime: Date.now()
    };

    try {

        const collect: any = await Collect.findOne({ query: collectQuery });

        if (!collect) {
            await Collect.save({ data });
        } else {
            await Collect.removeOne({ query: collectQuery });
        }

        const article: any = await ArticlePublish.findOne({ query: articleQuery });

        if (article) {
            const { collectCount } = article;
            const count = !collect ? collectCount + 1 : collectCount - 1;
            if (JSON.stringify(userId) !== JSON.stringify(article.userId._id)) {
                await messageSave({ fromUserId: userId, toUserId: article.userId._id, collectId: articleId, type: 1 });
            }
            await ArticlePublish.updateOne({ query: articleQuery, update: { collectCount: count } });
        }

        await updateCollectCount(userId);

        SuccessMsg(res, {});

    } catch(e) {
        ErrorMsg(res, {});
    }

}

// 点赞
export const articlePublishLike = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { articleId } = req.body;

    const articleQuery: any = { _id: articleId };
    const likeQquery: any = { 
        articleId,
        createUserId: userId
     };
    const data: any = {
        ...likeQquery,
        createTime: Date.now()
    };
    
    Like.findOne({ query: likeQquery }).then((resp) => {
        let type: any = resp;
        let count: number = 0;
        let p = !type ? Like.save({ data }) : Like.removeOne({ query: likeQquery });

        p.then(() => {
            return ArticlePublish.findOne({ query: articleQuery });
        }).then((resp: any) => {
            count = !type ? resp.likeCount + 1 : resp.likeCount - 1;
            if (JSON.stringify(userId) !== JSON.stringify(resp.userId._id)) {
                return messageSave({ fromUserId: userId, toUserId: resp.userId._id, likeId: articleId, type: 0 });
            } 
        }).then(() => {
            return ArticlePublish.updateOne({ query: articleQuery, update: { likeCount: count } }); // 更新文章
        }).then(() => {
            SuccessMsg(res, {});
        }).catch(() => {
            ErrorMsg(res, {});
        })
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 发布
export const articlePublish = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const data: any = {
        ...req.body,
        userId,
        publishTime: Date.now()
    };
    let articlePublishId: any;

    ArticlePublish.save({ data }).then((resp: any) => {
        articlePublishId = resp._id
        return updateArticleCount(userId);
    }).then(() => {
        return updateTagArticleCount()
    }).then(() => {
        emit('NEW_POST', {
            type: 'newPost'
        });
        SuccessMsg(res, { data: { articlePublishId } });
    }).catch((err: any) => {
        ErrorMsg(res, { msg: err });
    });
}

// 更新发布
export const articlePublishUpdate = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { articlePublishId } = req.params;
    const update: any = {
        ...req.body,
        userId,
        publishTime: Date.now()
    };
    const query: any = { _id: articlePublishId };

    ArticlePublish.updateOne({ query, update }).then(() => {
        emit('NEW_POST', {
            type: 'newPost'
        });
        SuccessMsg(res, {});
    }).catch((err: any) => {
        ErrorMsg(res, { msg: err });
    });
}

// 删除发布(取消发布)
export const articlePublishDelete = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { articlePublishId, articleId } = req.params;
    const query = {
        _id: articlePublishId,
        userId
    };
    const articleQuery = { _id: articleId}
    const update = {
        isPublish: false
    }

    try {
        let isLike = await Like.findOne({
            query: { articleId: articlePublishId }
        });
        if (isLike) return ErrorMsg(res, { msg: '文章已被点赞，不能取消发布！' });

        let isCollect = await Collect.findOne({
            query: { articleId: articlePublishId }
        });
        if (isCollect) return ErrorMsg(res, { msg: '文章已被收藏，不能取消发布！' });

        let isTopicArticle = await TopicArticle.findOne({
            query: { articleId: articlePublishId }
        });
        if (isTopicArticle) return ErrorMsg(res, { msg: '文章已被加入专题，不能取消发布！' });

        await ArticlePublish.removeOne({ query });
        await Article.updateOne({ query: articleQuery, update });
        await updateArticleCount(userId);
        await updateTagArticleCount();

        SuccessMsg(res, {});
    } catch (err) {
        ErrorMsg(res, { msg: '文章删除失败！' });
    }

}
