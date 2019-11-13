/**
 * 文章分类
 */

import { ArticleCate, Article } from '../model';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

// 列表
export const articleCateQuery = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const query = {
        userId
    };

    const articleCateQuery = ArticleCate.find({ query });

    articleCateQuery.then((resp: any) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}


// 新增
export const articleCateAdd = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const data: any = {
        ...req.body,
        userId,
        createTime: Date.now()
    };

    ArticleCate.save({ data }).then((resp: any) => {
        SuccessMsg(res, { data: { articleCateId: resp._id } });
    }).catch((err: any) => {
        ErrorMsg(res, { msg: err });
    });
}

// 编辑
export const articleCateEdit = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { articleCateId } = req.params;
    const update: any = {
        ...req.body,
        userId,
        editTime: Date.now()
    };
    const query: any = { _id: articleCateId };

    ArticleCate.updateOne({ query, update }).then(() => {
        SuccessMsg(res, {});
    }).catch((err: any) => {
        ErrorMsg(res, { msg: err });
    });
}

// 删除
export const articleCateDelete = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { articleCateId } = req.params;
    const cateQuery = {
        _id: articleCateId,
        userId
    };
    const articleQuery = {
        articleCateId,
        userId
    };

    try {
        await ArticleCate.removeOne({ query: cateQuery });
        let articles: any = await Article.find({ query: articleQuery });
    
        if (articles && articles.length > 0) {
            articles.map(async (item: any) => {
                const query = {
                    _id: item._id
                };
                // 删除一个字段
                const update = {
                    $unset:{'articleCateId':''},
                    editTime: Date.now()
                };
                await Article.updateOne({ query, update });
            });
        }
    
        SuccessMsg(res, {});
    } catch (err) {
        ErrorMsg(res, { msg: err });
    }
}
