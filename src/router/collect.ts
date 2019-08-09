import Collect from '../model/collect';
import { SuccessMsg, ErrorMsg } from '../utils/utils';

// 列表
export const collectQuery  = (req: any, res: any) => {
    const { userId, currentPage, pageSize } = req.body;
    const query = { createUserId: userId };
    const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
    const querylimit: number = parseInt(pageSize);

    const p1 = Collect.collectQueryLimit({ query, querySkip, querylimit });
    const p2 = Collect.count(query);

    Promise.all([p1, p2]).then((resp) => {
        SuccessMsg(res, { data: resp[0].map((item: any) => item.articleId), total: resp[1] });
    });
}
