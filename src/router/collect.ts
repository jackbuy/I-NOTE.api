import Collect from '../model/collect';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

// 列表
export const collectQuery  = (req: any, res: any) => {
    const { userId, currentPage, pageSize } = req.body;
    const query: any = { createUserId: userId };
    const select: string = 'articleId';
    const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
    const querylimit: number = parseInt(pageSize);

    const p1 = Collect.collectQueryLimit({ query, select, querySkip, querylimit });
    const p2 = Collect.count(query);
    const p3 = Collect.find({ query });

    Promise.all([p1, p2, p3]).then((resp) => {
        let result: any = [];
        let result2: any = [];
        resp[0].map((item: any) => {
            if (item.articleId) {
                result.push(item.articleId)
            } else {
                result2 = resp[2];
                result2.map((item2: any) => {
                    if (JSON.stringify(item2._id) == JSON.stringify(item._id)) {
                        result.push({
                            _id: item2.articleId
                        })
                    }
                })
            }
        })
        SuccessMsg(res, { data: result, total: resp[1] });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}
