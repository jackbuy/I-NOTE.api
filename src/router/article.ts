import { Article, Like, Collect, Follow } from '../model';
import { updateArticleCount, updateCollectCount, updateTagArticleCount } from './common';
import { messageSave } from './message';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

/**
 * 查询文章(模糊查询)
 */
export const articleQuery  = (req: any, res: any) => {
    const { keyword, tagId, publish, userId, currentPage, pageSize, sortType = 'newest' } = req.body;
    let querySort: any = {};
    let query: any = { publish };

    if (userId) query.userId = userId;
    if (keyword) {
        const reg = new RegExp(keyword, 'i') //不区分大小写
        query.$or = [ //多条件，数组
            { title: { $regex: reg } },
            { contentText: { $regex: reg } }
        ]
    }
    if (tagId) query.tagId = tagId;
    if (sortType == 'newest') querySort = { top: -1, editTime: -1 }
    if (sortType == 'popular') querySort = { top: -1, viewCount: -1 }

    const articleQuery = Article.queryListLimit({ query, currentPage, pageSize, querySort });

    articleQuery.then((resp) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 详情
export const articleDetail  = (req: any, res: any) => {
    const { articleId } = req.body;
    const query: any = { _id: articleId };
    let userId: string = '';
    let result: any = {};
    if (req.userMsg) userId = req.userMsg.userId;

    Article.findOne({ query }).then((resp: any) => {
        return Article.updateOne({ query, update: { viewCount: resp.viewCount + 1 } })
    }).then(() => {
        return Article.queryDetail({ query })
    }).then((resp: any) => {
        if (resp) result = resp;
        return userId ? Follow.findOne({ query: { userId, followUserId: resp.userId._id } }) : Promise.resolve(null);
    }).then((resp: any) => {
        if (resp) result.userId.isFollow = true;
        return userId ? Like.findOne({ query: { createUserId: userId, articleId } }) : Promise.resolve(null);
    }).then((resp: any) => {
        if (resp) result.isLike = true;
        return userId ? Collect.findOne({ query: { createUserId: userId, articleId } }) : Promise.resolve(null);
    }).then((resp: any) => {
        if (resp) result.isCollect = true;
        SuccessMsg(res, { data: result });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 收藏
export const articleCollect = async (req: any, res: any) => {
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

        const article: any = await Article.findOne({ query: articleQuery });

        if (article) {
            const { collectCount } = article;
            const count = !collect ? collectCount + 1 : collectCount - 1;
            await messageSave({ fromUserId: userId, toUserId: article.userId._id, collectId: articleId, type: 1 });
            await Article.updateOne({ query: articleQuery, update: { collectCount: count } });
        }

        await updateCollectCount(userId);

        SuccessMsg(res, {});

    } catch(e) {
        ErrorMsg(res, {});
    }

}

// 点赞
export const articleLike = (req: any, res: any) => {
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
            return Article.findOne({ query: articleQuery });
        }).then((resp: any) => {
            count = !type ? resp.likeCount + 1 : resp.likeCount - 1;
            return messageSave({ fromUserId: userId, toUserId: resp.userId._id, likeId: articleId, type: 0 });
        }).then(() => {
            return Article.updateOne({ query: articleQuery, update: { likeCount: count } }); // 更新文章
        }).then(() => {
            SuccessMsg(res, {});
        }).catch(() => {
            ErrorMsg(res, {});
        })
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 新增
export const articleAdd  = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const data: any = {
        ...req.body,
        userId,
        createTime: Date.now()
    };
    let result: any = {};

    Article.save({ data }).then((resp: any) => {
        result = resp;
        updateArticleCount(userId);
    }).then(() => {
        updateTagArticleCount()
    }).then(() => {
        SuccessMsg(res, { data: { articleId: result._id } });
    }).catch((err: any) => {
        ErrorMsg(res, { msg: err });
    });
}

// 编辑
export const articleEdit = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { articleId } = req.params;
    const update: any = {
        ...req.body,
        userId,
        editTime: Date.now()
    };
    const query: any = { _id: articleId };

    Article.updateOne({ query, update }).then((resp: any) => {
        updateArticleCount(userId);
    }).then(() => {
        updateTagArticleCount()
    }).then(() => {
        SuccessMsg(res, {});
    }).catch((err: any) => {
        ErrorMsg(res, { msg: err });
    });
}

// 删除
export const articleDelete  = (req: any, res: any) => {
    const { articleId } = req.params;
    const { userId } = req.userMsg;
    const query = { _id: articleId };
    let result: any = {};

    Article.removeOne({ query }).then((resp: any) => {
        result = resp;
        updateArticleCount(userId);
    }).then(() => {
        updateTagArticleCount()
    }).then(() => {
        const { deletedCount } = result;
        if (deletedCount === 1) {
            SuccessMsg(res, {});
        } else {
            ErrorMsg(res, { msg: '文章删除失败！' });
        }
    }).catch((err: any) => {
        ErrorMsg(res, { msg: '文章已不存在！' });
    });
}
