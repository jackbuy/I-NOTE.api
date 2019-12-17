/**
 * 文章分类
 */

import { ArticleCate, Article } from '../model';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

// 列表
export const articleCateQuery = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const query: any = {
        userId
    };

    try{
        const result: any = await ArticleCate.find({ query });
        SuccessMsg(res, { data: result });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 新增
export const articleCateAdd = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const data: any = {
        ...req.body,
        userId,
        createTime: Date.now()
    };

    try{
        const result: any = await ArticleCate.save({ data });
        SuccessMsg(res, { data: { articleCateId: result._id } });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 编辑
export const articleCateEdit = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { articleCateId } = req.params;
    const update: any = {
        ...req.body,
        userId,
        editTime: Date.now()
    };
    const query: any = { _id: articleCateId };

    try{
        await ArticleCate.updateOne({ query, update });
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 删除
export const articleCateDelete = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { articleCateId } = req.params;
    const cateQuery: any = {
        _id: articleCateId,
        userId
    };
    const articleQuery: any = {
        articleCateId,
        userId
    };

    try {
        await ArticleCate.removeOne({ query: cateQuery });
        let articles: any = await Article.find({ query: articleQuery });
        if (articles) {
            for await (const item of articles) {
                const query = {
                    _id: item._id
                };
                // 删除一个字段
                const update = {
                    $unset:{'articleCateId':''},
                    editTime: Date.now()
                };
                await Article.updateOne({ query, update });
            }
        }
        SuccessMsg(res, {});
    } catch (err) {
        ErrorMsg(res, { msg: err });
    }
}
