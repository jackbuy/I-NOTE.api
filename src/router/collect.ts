import { Collect, ArticlePublish } from '../model';
import Utils from '../utils/utils';
import { updateCollectCount } from './common';
const { SuccessMsg, ErrorMsg } = Utils;

// 列表
export const collectQuery = async (req: any, res: any) => {
    const { userId, currentPage, pageSize } = req.body;
    const query: any = { createUserId: userId };

    try{
        const result: any = await Collect.queryListLimit({ query, currentPage, pageSize });
        SuccessMsg(res, { data: result });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 删除
export const collectDelete = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { collectId, articleId } = req.params;
    const query: any = {
        _id: collectId
    };
    const articleQuery: any = { _id: articleId };

    try {
        await Collect.removeOne({ query })
        const article: any = await ArticlePublish.findOne({ query: articleQuery });
        if (article) {
            let { collectCount } = article;
            collectCount--;
            await ArticlePublish.updateOne({ query: articleQuery, update: { collectCount } });
        }
        await updateCollectCount(userId);
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
}