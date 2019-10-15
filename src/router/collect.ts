import { Collect, ArticlePublish } from '../model';
import Utils from '../utils/utils';
import { updateCollectCount } from './common';
const { SuccessMsg, ErrorMsg } = Utils;

// 列表
export const collectQuery  = (req: any, res: any) => {
    const { userId, currentPage, pageSize } = req.body;
    const query: any = { createUserId: userId };
    const collectQuery = Collect.queryListLimit({ query, currentPage, pageSize });

    collectQuery.then((resp) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
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
        const result: any = await Collect.removeOne({ query })

        const { deletedCount } = result;

        if (deletedCount === 1) {

            const article: any = await ArticlePublish.findOne({ query: articleQuery });

            if (article) {
                const { collectCount } = article;
                const count = collectCount - 1;
                await ArticlePublish.updateOne({ query: articleQuery, update: { collectCount: count } });
            }

            await updateCollectCount(userId);

            SuccessMsg(res, {});

        } else {
            ErrorMsg(res, { msg: '收藏删除失败！' });
        }
    } catch(e) {
        ErrorMsg(res, {});
    }

}