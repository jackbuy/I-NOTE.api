import { Article } from '../schema';
import { SuccessMsg, ErrorMsg } from '../utils/utils';

// 列表
export const articleQuery  = (req: any, res: any) => {
    // const { userId } = req.userMsg;
    Article.find().then((resp: any) => {
        const total: Number = resp.length;
        SuccessMsg( res, { data: resp, total} );
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
    const { title, contentText, contentHtml } = req.body;
    const data: any = {
        userId,
        title,
        contentText,
        contentHtml
    };
    new Article(data).save().then(() => {
        SuccessMsg(res, {});
    });
}

// 编辑
export const articleEdit  = (req: any, res: any) => {
    res.send('edit');
}

// 删除
export const articleDelete  = (req: any, res: any) => {
    res.send('delete');
}