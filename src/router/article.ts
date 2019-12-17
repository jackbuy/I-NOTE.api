/**
 * 未发布文章
 */

import { Article } from '../model';
import Utils from '../utils/utils';
import { fileDel } from './fileManage';
const { SuccessMsg, ErrorMsg } = Utils;

// 列表
export const articleQuery = async (req: any, res: any) => {
    const { articleCateId, type, keyword, currentPage, pageSize } = req.body;
    const { userId } = req.userMsg;
    let query: any = {
        userId
    };
    if (articleCateId !== 'all') {
        articleCateId !== 'no-cate' ? query.articleCateId = articleCateId : query.articleCateId = { $exists: false };
    }
    if (type === 'publish') query.isPublish = true;
    if (type === 'draft') query.isPublish = false;
    if (keyword) {
        const reg = new RegExp(keyword, 'i') //不区分大小写
        query.$or = [ //多条件，数组
            { title: { $regex: reg } },
            { contentHtml: { $regex: reg } }
        ]
    }

    try {
        const result: any = await Article.queryListLimit({ query, currentPage, pageSize });
        const total: any = await Article.count({query});
        SuccessMsg(res, { data: result, total });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 详情
export const articleDetail = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { articleId } = req.params;
    const query = {
        _id: articleId,
        userId
    };

    try{
        const result: any = await Article.queryDetail({ query });
        if (!result) {
            ErrorMsg(res, { msg: '文章不存在' });
        } else {
            SuccessMsg(res, { data: result });
        }
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 新增
export const articleAdd = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const data: any = {
        ...req.body,
        userId,
        createTime: Date.now()
    };

    try{
        const result: any = await Article.save({ data });
        SuccessMsg(res, { data: { articleId: result._id } });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 编辑
export const articleEdit = async (req: any, res: any) => {
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

    try{
        await Article.updateOne({ query, update });
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 删除
export const articleDelete = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { articleId } = req.params;
    const query = {
        _id: articleId,
        userId
    };

    try{
        await Article.removeOne({ query });
        await fileDel(articleId, '0'); // 删除文章相关联的图片
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, { msg: '文章不存在！' });
    }
}
