import { Article, User, Tag, Message, Support } from '../schema';
import { SuccessMsg, ErrorMsg } from '../utils/utils';

// 查询文章(模糊查询)
export const articleQuery  = (req: any, res: any) => {
    let userId: String = '';
    const { keyword, tagName, publish, mine } = req.body;
    let params: any = { publish };
    const reg = new RegExp(keyword, 'i') //不区分大小写
    if (req.userMsg) userId = req.userMsg.userId;
    if (userId && mine) params.userId = userId;
    if (keyword) {
        params.$or = [ //多条件，数组
            { title : { $regex: reg } },
            { contentText : { $regex: reg } }
        ]
    }
    if (tagName) params.tagName = tagName;
    Article.find(params, {__v: 0})
    .populate({path: 'userId', model: User, select: 'username'})
    .sort({ _id: -1 }).exec((err, resp) => {
        if (!err) {
            let result: any[] = []
            Support.find().then((resp2) => { // 查询已赞
                resp.map((item: any) => {
                    resp2.map((item2: any) => {
                        if (item._id == item2.articleId && userId == item2.createUserId) item.isSupport = true;
                    });
                    result.push(item);
                });
                SuccessMsg(res, {data: result});
            });
        } else {
            ErrorMsg(res, {});
        }
    });
}

// 详情
export const articleDetail  = (req: any, res: any) => {
    const { articleId } = req.body;
    const query = {_id: articleId};
    Article.findOne(query).then((resp: any) => {
        const { viewCount } = resp;
        Article.updateOne(query, { viewCount: viewCount + 1 })
        .then(() => {
            Article.findOne(query)
            .populate({path: 'userId', model: User, select: 'username'})
            .then((resp2: any) => {
                SuccessMsg( res, { data: resp2 } );
            });
        })
        .catch(( err: any ) => {ErrorMsg(res, {msg: err});});
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
    Support.findOne( { articleId: articleId, createUserId: userId } ).then((resp1) => {
        if (!resp1) {
            new Support(data).save().then(() => {
                Article.findOne(query).then((resp2: any) => {
                    const { supportCount } = resp2;
                    Article.updateOne(query, { supportCount: supportCount + 1 })
                    .then(() => {SuccessMsg(res, {});})
                    .catch(( err: any ) => {ErrorMsg(res, {msg: err});});
                });
            });
        } else {
            ErrorMsg(res, {msg: '您已点赞！'});
        }
    });
}

// 新增
export const articleAdd  = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { title, contentText, contentHtml, publish, tagName } = req.body;
    const data: any = {
        userId,
        title,
        contentText,
        contentHtml,
        publish,
        tagName,
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
    const { title, contentText, contentHtml, publish, tagName } = req.body;
    const update: any = {
        userId,
        title,
        contentText,
        contentHtml,
        publish,
        tagName,
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
