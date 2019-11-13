/**
 * 未发布文章
 */

import { Article } from '../model';
import Utils from '../utils/utils';
import { fileDel } from './fileManage';
const { SuccessMsg, ErrorMsg } = Utils;

// 列表
export const articleQuery = (req: any, res: any) => {
    const { articleCateId, type, keyword, currentPage, pageSize } = req.body;
    const { userId } = req.userMsg;
    const querySort: any = {
        editTime: -1
    };
    let query: any = {
        userId
    };
    if (articleCateId !== 'all') {
        if (articleCateId !== 'no-cate') {
            query.articleCateId = articleCateId;
        } else {
            query.articleCateId = { $exists: false };
        }
    }
    if (type === 'publish') query.isPublish = true;
    if (type === 'draft') query.isPublish = false;

    let result: any = [];

    if (keyword) {
        const reg = new RegExp(keyword, 'i') //不区分大小写
        query.$or = [ //多条件，数组
            { title: { $regex: reg } },
            { contentHtml: { $regex: reg } }
        ]
    }

    const articleQuery = Article.queryListLimit({ query, currentPage, pageSize });

    articleQuery.then((resp) => {
        result = resp;
        return Article.count({query});
    }).then((resp: any) => {
        SuccessMsg(res, { data: result, total: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 详情
export const articleDetail = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { articleId } = req.params;
    const query = {
        _id: articleId,
        userId
    };
    Article.queryDetail({ query }).then((resp) => {
        if (!resp) {
            ErrorMsg(res, { msg: '文章不存在' });
        } else {
            SuccessMsg(res, { data: resp });
        }
    }).catch(() => {
        ErrorMsg(res, {});
    })
}

// 新增
export const articleAdd = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const data: any = {
        ...req.body,
        userId,
        createTime: Date.now()
    };

    Article.save({ data }).then((resp: any) => {
        SuccessMsg(res, { data: { articleId: resp._id } });
    }).catch((err: any) => {
        ErrorMsg(res, { msg: err });
    });
}

// 编辑
export const articleEdit = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { articleId } = req.params;
    const { articleCateId } = req.body;
    let update: any;

    // 切换分组（未分组）
    if (articleCateId && articleCateId === 'no-cate') {
        update = {
            $unset:{'articleCateId':''},
            editTime: Date.now()
        };
    } else {
        update = {
            ...req.body,
            userId,
            editTime: Date.now()
        };
    }

    const query: any = { _id: articleId };

    Article.updateOne({ query, update }).then(() => {
        SuccessMsg(res, {});
    }).catch((err: any) => {
        ErrorMsg(res, { msg: err });
    });
}

// 删除
export const articleDelete = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { articleId } = req.params;
    const query = {
        _id: articleId,
        userId
    };

    Article.removeOne({ query }).then((resp: any) => {
        const { deletedCount } = resp;
        if (deletedCount === 1) {
            fileDel(articleId, '0').then(() => {
                SuccessMsg(res, {});
            }).catch(() => {
                ErrorMsg(res, { msg: '相关图片删除失败！' });
            });
        } else {
            ErrorMsg(res, { msg: '文章删除失败！' });
        }
    }).catch((err: any) => {
        ErrorMsg(res, { msg: '文章已不存在！' });
    });
}
