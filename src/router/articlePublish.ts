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
export const articlePublishQuery = async (req: any, res: any) => {
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
    if (sortType == 'newest') querySort = { publishTime: -1 };
    if (sortType == 'popular') querySort = { viewCount: -1 };

    try{
        const result: any = await ArticlePublish.queryListLimit({ query, currentPage, pageSize, querySort });
        SuccessMsg(res, { data: result });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 详情
export const articlePublishDetail = async (req: any, res: any) => {
    const { articleId } = req.body;
    const query: any = {
        _id: articleId
    };
    let userId: string = '';
    if (req.userMsg) userId = req.userMsg.userId;

    try{
        // 详情
        let detail: any = await ArticlePublish.queryDetail({ query });
        // 浏览次数+1
        let { viewCount } = detail;
        viewCount++;
        await ArticlePublish.updateOne({ query, update: { viewCount } });
        detail._doc.viewCount = viewCount;
        // 是否关注
        const isFollow: any = await Follow.findOne({ query: { userId, followUserId: detail.userId._id } });
        detail.userId._doc.isFollow = isFollow ? true : false;
        // 是否点赞
        const isLike: any = await Like.findOne({ query: { createUserId: userId, articleId } });
        detail._doc.isLike = isLike ? true : false;
        // 是否收藏
        const isCollect: any = await Collect.findOne({ query: { createUserId: userId, articleId } });
        detail._doc.isCollect = isCollect ? true : false;

        SuccessMsg(res, { data: detail });
    } catch(e){
        ErrorMsg(res, {});
    }
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
            let { collectCount } = article;
            !collect ? collectCount++ : collectCount--;
            if (JSON.stringify(userId) !== JSON.stringify(article.userId._id)) {
                await messageSave({
                    fromUserId: userId,
                    toUserId: article.userId._id,
                    collectId: articleId,
                    type: 1
                });
            }
            await ArticlePublish.updateOne({ query: articleQuery, update: { collectCount } });
        }
        await updateCollectCount(userId);
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 点赞
export const articlePublishLike = async (req: any, res: any) => {
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

    try{
        const isLike: any = await Like.findOne({ query: likeQquery });
        if (!isLike) {
            await Like.save({ data });
        } else {
            await Like.removeOne({ query: likeQquery });
        }
        const article: any = await ArticlePublish.findOne({ query: articleQuery });
        if (article) {
            let { likeCount } = article;
            !isLike ? likeCount++ : likeCount--;
            if (JSON.stringify(userId) !== JSON.stringify(article.userId._id)) {
                await messageSave({
                    fromUserId: userId,
                    toUserId: article.userId._id,
                    likeId: articleId,
                    type: 0
                });
            }
            await ArticlePublish.updateOne({ query: articleQuery, update: { likeCount } }); // 更新文章
        }
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 发布
export const articlePublish = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const data: any = {
        ...req.body,
        userId,
        publishTime: Date.now()
    };

    try{
        const detail: any = await ArticlePublish.save({ data });
        const articlePublishId: any = detail._id
        await updateArticleCount(userId);
        await updateTagArticleCount();
        emit('NEW_POST', {
            type: 'newPost'
        });
        SuccessMsg(res, { data: { articlePublishId } });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 更新发布
export const articlePublishUpdate = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { articlePublishId } = req.params;
    const update: any = {
        ...req.body,
        userId,
        publishTime: Date.now()
    };
    const query: any = { _id: articlePublishId };

    try{
        await ArticlePublish.updateOne({ query, update });
        emit('NEW_POST', {
            type: 'newPost'
        });
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
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
