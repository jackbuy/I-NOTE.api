import Article from '../model/article';
import Support from '../model/support';
import Collect from '../model/collect';
import Follow from '../model/follow';
import { updateArticleCount, updateCollectCount } from './user';
import { messageSave } from './message';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

const setArrVal = (arr1: any, arr2: any, currentUserId: string, type: string) => {
    let arr: any = [];
    arr1.map((item: any) => {
        arr2.map((resp_item: any) => {
            if (item._id == resp_item.articleId && currentUserId == resp_item.createUserId) item[type] = true;
        });
        arr.push(item);
    });
    return arr;
}

/**
 * 查询文章(模糊查询)
 */
export const articleQuery  = (req: any, res: any) => {
    const { keyword, tagId, publish, userId, currentPage = 1, pageSize = 25, sortType = 'newest' } = req.body;
    let currentUserId: string = ''; // 当前登录用户
    let querySort: any = {};
    let query: any = { publish };
    const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
    const querylimit: number = parseInt(pageSize);

    if (userId) query.userId = userId;
    if (req.userMsg) currentUserId = req.userMsg.userId;
    if (keyword) {
        const reg = new RegExp(keyword, 'i') //不区分大小写
        query.$or = [ //多条件，数组
            { title: { $regex: reg } },
            { contentText: { $regex: reg } }
        ]
    }
    if (tagId) query.tagId = tagId;
    if (sortType == 'newest') querySort = { top: -1, createTime: -1 }
    if (sortType == 'popular') querySort = { top: -1, viewCount: -1 }

    const p1 = Article.queryLimit({ query, querylimit, querySkip, querySort, publish});
    const p2 = Article.count(query);
    const p3 = Support.find({});
    const p4 = Collect.find({});

    Promise.all([ p1, p2, p3, p4 ]).then((resp) => {
        let result: any[] = [];
        result = setArrVal(resp[0], resp[2], currentUserId, 'isSupport');
        result = setArrVal(resp[0], resp[3], currentUserId, 'isCollect');
        SuccessMsg(res, { data: result, total: resp[1] });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 详情
export const articleDetail  = (req: any, res: any) => {
    const { articleId, isEdit = 'false' } = req.body;
    const query: any = { _id: articleId };
    let userId: string = '';
    let result: any = {};
    if (req.userMsg) userId = req.userMsg.userId;

    Article.findOne({ query }).then((resp: any) => {
        return Article.updateOne({ query, update: { viewCount: resp.viewCount + 1 } })
    }).then(() => {
        return Article.findOnePopulate({ query, isEdit })
    }).then((resp: any) => {
        result = resp;
        return Follow.findOne({ query: { userId, type: 0, followId: resp.userId._id } });
    }).then((resp: any) => {
        if (resp) result.userId.isFollow = true;
        return Support.findOne({ query: { createUserId: userId, articleId } });
    }).then((resp: any) => {
        if (resp) result.isSupport = true;
        return Collect.findOne({ query: { createUserId: userId, articleId } });
    }).then((resp: any) => {
        if (resp) result.isCollect = true;
        SuccessMsg(res, { data: result });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 收藏
export const articleCollect = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { articleId } = req.params;
    const query: any = { _id: articleId };
    const data: any = {
        articleId,
        createUserId: userId,
        createTime: Date.now()
    };
    let collectCount: number = 0;

    Collect.findOne({ query: { articleId: articleId, createUserId: userId } }).then((resp1: any) => {
        if (!resp1) {
            Collect.save(data).then(() => {
                return Article.findOne({ query });
            }).then((resp: any) => {
                collectCount = resp.collectCount;
                return messageSave({ relativeId: articleId, createUserId: userId, receiveUserId: resp.userId, type: 2 }); // 保存消息
            }).then(() => {
                return Article.updateOne({ query, update: { collectCount: collectCount + 1 } }) // 更新文章
            }).then(() => {
                return updateCollectCount(userId);
            }).then(() => {
                SuccessMsg(res, {});
            }).catch(() => {
                ErrorMsg(res, {});
            });
        } else {
            Collect.removeOne({ articleId }).then(() => {
                return Article.findOne({ query });
            }).then((resp: any) => {
                collectCount = resp.collectCount;
            }).then(() => {
                return Article.updateOne({ query, update: { collectCount: collectCount - 1 } }); // 更新文章
            }).then(() => {
                return updateCollectCount(userId);
            }).then(() => {
                SuccessMsg(res, {});
            }).catch(() => {
                ErrorMsg(res, {});
            });
        }
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 点赞
export const articleSupport = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { articleId } = req.params;
    const query: any = { _id: articleId };
    const data: any = {
        articleId,
        createUserId: userId,
        createTime: Date.now()
    };
    let supportCount: number = 0;

    Support.findOne({ query: { articleId: articleId, createUserId: userId } }).then((resp1) => {
        if (!resp1) {
            Support.save(data).then(() => {
                return Article.findOne({ query });
            }).then((resp: any) => {
                supportCount = resp.supportCount;
                return messageSave({ relativeId: articleId, createUserId: userId, receiveUserId: resp.userId, type: 1 }); // 保存消息
            }).then(() => {
                return Article.updateOne({ query, update: { supportCount: supportCount + 1 } }); // 更新文章
            }).then(() => {
                SuccessMsg(res, {});
            }).catch(() => {
                ErrorMsg(res, {});
            })
        } else {
            Support.removeOne({ articleId }).then(() => {
                return Article.findOne({ query });
            }).then((resp: any) => {
                supportCount = resp.supportCount;
            }).then(() => {
                return Article.updateOne({ query, update: { supportCount: supportCount - 1 } }); // 更新文章
            }).then(() => {
                SuccessMsg(res, {});
            }).catch(() => {
                ErrorMsg(res, {});
            });
        }
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

    Article.save(data).then((resp: any) => {
        result = resp;
        return updateArticleCount(userId);
    }).then(() => {
        SuccessMsg(res, { data: { articleId: result._id } });
    }).catch((err: any) => {
        ErrorMsg(res, { msg: err });
    });
}

// 编辑
export const articleEdit  = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { articleId } = req.params;
    const update: any = {
        ...req.body,
        userId,
        editTime: Date.now()
    };
    const query: any = { _id: articleId };

    Article.updateOne({ query, update }).then((resp: any) => {
        return updateArticleCount(userId);
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

    Article.removeOne(query).then((resp: any) => {
        result = resp;
        return updateArticleCount(userId);
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
