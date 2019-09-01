import { Collect } from '../model';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

// 列表
export const collectQuery  = (req: any, res: any) => {
    const { userId, currentPage, pageSize } = req.body;
    const query: any = { createUserId: userId };

    const p1 = Collect.queryListLimit({ query, currentPage, pageSize });
    const p2 = Collect.find({ query });

    Promise.all([p1, p2]).then((resp) => {
        let result: any = [];
        let result2: any = [];
        resp[0].map((item: any) => {
            if (item.articleId) {
                result.push(item.articleId)
            } else {
                result2 = resp[1];
                result2.map((item2: any) => {
                    if (JSON.stringify(item2._id) == JSON.stringify(item._id)) {
                        result.push({
                            _id: item2.articleId
                        })
                    }
                })
            }
        })
        SuccessMsg(res, { data: result });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}
