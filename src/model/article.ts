import { Article, User, Tag, Message, Support, Collect } from '../schema';
import { SuccessMsg, ErrorMsg } from '../utils/utils';

// 查询文章(模糊查询)
export const articleQuery  = (req: any, res: any) => {
    const { keyword, tagName, publish, mine, currentPage = 1, pageSize = 25 } = req.body;
    let userId: string = '';
    let params: any = { publish };
    const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
    const querylimit: number = parseInt(pageSize);

    if (req.userMsg) userId = req.userMsg.userId;
    if (userId && mine) params.userId = userId;
    if (keyword) {
        const reg = new RegExp(keyword, 'i') //不区分大小写
        params.$or = [ //多条件，数组
            { title : { $regex: reg } },
            { contentText : { $regex: reg } }
        ]
    }
    if (tagName) params.tagName = tagName;

    let result: any[] = [];
    let articleData: any[] = [];
    let total: number;

    Article
        .find(params, {__v: 0})
        .populate({path: 'userId', model: User, select: 'username'})
        .sort({ _id: -1 })
        .skip(querySkip)
        .limit(querylimit)
        .then((article_data) => {
            articleData = article_data;
            return Article.find(params).countDocuments();
        })
        .then((article_count = 0) =>{
            total = article_count;
            return Support.find();
        })
        .then((support_data) => {
            articleData.map((item: any) => {
                support_data.map((item2: any) => {
                    if (item._id == item2.articleId && userId == item2.createUserId) item.isSupport = true;
                });
                result.push(item);
            });
            return Collect.find();
        })
        .then((collect_count) => {
            result.map((item: any) => {
                collect_count.map((item2: any) => {
                    if (item._id == item2.articleId && userId == item2.createUserId) item.isCollect = true;
                });
            });
        })
        .then(() => {
            SuccessMsg(res, {data: result, total});
        })
        .catch((err) => {
            ErrorMsg(res, {msg: err});
        });
}

// 详情
export const articleDetail  = (req: any, res: any) => {
    const { articleId } = req.body;
    const query = {_id: articleId};

    Article.findOne(query)
        .then((resp: any) => Article.updateOne(query, { viewCount: resp.viewCount + 1 }))
        .then(() => Article.findOne(query).populate({path: 'userId', model: User, select: 'username'}))
        .then((resp: any) => {
            SuccessMsg( res, { data: resp } );
        })
        .catch((err: any) => {
            ErrorMsg(res, {msg: err});
        });
}

// 收藏
export const articleCollect = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { articleId } = req.params;
    const query = { _id: articleId };
    const data: any = {
        articleId,
        createUserId: userId,
        createTime: Date.now()
    };
    
    let collectCount: number = 0;
    Collect.findOne( { articleId: articleId, createUserId: userId } )
        .then((resp1) => {
            if (!resp1) {
                new Collect(data).save()
                    .then(() => Article.findOne(query))
                    .then((resp: any) => {
                        collectCount = resp.collectCount;
                        // 保存消息
                        const msgData: any = {
                            articleId,
                            createUserId: userId,
                            receiveUserId: resp.userId,
                            type: 1
                        };
                        return new Message(msgData).save();
                    })
                    .then(() => Article.updateOne(query, { collectCount: collectCount + 1 })) // 更新文章
                    .then(() => {
                        SuccessMsg(res, {});
                    })
                    .catch((err: any) => {
                        ErrorMsg(res, {msg: err});
                    });
            } else {
                Collect.deleteOne({articleId})
                    .then(() => Article.findOne(query))
                    .then((resp: any) => {
                        collectCount = resp.collectCount;
                        // 保存消息
                        const msgData: any = {
                            articleId,
                            createUserId: userId,
                            receiveUserId: resp.userId,
                            type: 2
                        };
                        return new Message(msgData).save();
                    })
                    .then(() => Article.updateOne(query, { collectCount: collectCount - 1 })) // 更新文章
                    .then(() => {
                        SuccessMsg(res, {});
                    })
                    .catch((err: any) => {
                        ErrorMsg(res, {msg: err});
                    });
            }
        });
}

// 点赞
export const articleSupport = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { articleId } = req.params;
    const query = { _id: articleId };
    const data: any = {
        articleId,
        createUserId: userId,
        createTime: Date.now()
    };
    
    let supportCount: number = 0;
    Support.findOne( { articleId: articleId, createUserId: userId } )
        .then((resp1) => {
            if (!resp1) {
                new Support(data).save()
                    .then(() => Article.findOne(query))
                    .then((resp: any) => {
                        supportCount = resp.supportCount;
                        // 保存消息
                        const msgData: any = {
                            articleId,
                            createUserId: userId,
                            receiveUserId: resp.userId,
                            type: 0
                        };
                        return new Message(msgData).save();
                    })
                    .then(() => {
                        // 更新文章
                        return Article.updateOne(query, { supportCount: supportCount + 1 });
                    })
                    .then(() => {
                        SuccessMsg(res, {});
                    })
                    .catch((err: any) => {
                        ErrorMsg(res, {msg: err});
                    });
            } else {
                ErrorMsg(res, {msg: '您已点赞！'});
            }
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
    new Article(data).save().then((resp: any) => {
        SuccessMsg(res, { data: {articleId: resp._id }});
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
    const query: any = {_id: articleId};
    Article.updateOne(query, update)
        .then(() => {SuccessMsg(res, {});})
        .catch(( err: any ) => {ErrorMsg(res, {msg: err});});
}

// 删除
export const articleDelete  = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { articleId } = req.params;
    const query = {
        _id: articleId,
        userId
    };
    Article.deleteOne(query)
        .then((resp: any) => {
            const { deletedCount } = resp;
            if (deletedCount === 1) {
                SuccessMsg(res, {});
            } else {
                ErrorMsg(res, {msg: '文章删除失败！'});
            }
        })
        .catch(() => {ErrorMsg(res, {msg: '文章已不存在！'});});
}
