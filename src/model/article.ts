import { Article, User, Tag } from '../schema';
import { SuccessMsg, ErrorMsg } from '../utils/utils';

// 查询已发布的文章(模糊查询)
export const articleQuery  = (req: any, res: any) => {
    const userId: String = '';
    common(req, res, userId);
}

// 当前登录用户
export const articleUserQuery  = (req: any, res: any) => {
    const { userId } = req.userMsg;
    common(req, res, userId);
}

const common = (req: any, res: any, userId: String) => {
    const { keyword, tagName, publish } = req.body;
    let params: any = { publish };
    const reg = new RegExp(keyword, 'i') //不区分大小写
    if (userId) params.userId = userId;
    if (keyword) {
        params.$or = [ //多条件，数组
            { title : { $regex: reg } },
            { contentText : { $regex: reg } }
        ]
    }
    if (tagName) params.tagName = tagName;
    Article.find(params, {__v: 0})
    .populate({path: 'userId', model: User, select: 'username'})
    // .populate({path: 'tagName', model: Tag, select: 'title'})
    .sort({ _id: -1 }).exec((err, resp) => {
        if (!err) {
            SuccessMsg(res, {data: resp});
        } else {
            ErrorMsg(res, {});
        }
    });
}

// 详情
export const articleDetail  = (req: any, res: any) => {
    const { articleId } = req.body;
    Article.findById(articleId).then((resp: any) => {
        SuccessMsg( res, { data: resp} );
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
