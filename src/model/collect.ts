import { Collect, User, Article } from '../schema';
import { SuccessMsg, ErrorMsg } from '../utils/utils';

// 列表
export const collectQuery  = (req: any, res: any) => {
    const { userId, currentPage, pageSize } = req.body;
    const query = { createUserId: userId };
    const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
    const querylimit: number = parseInt(pageSize);

    let result: any = [];
    let total: number = 0;
    Collect
        .find(query, 'articleId')
        .populate({ path: 'articleId', model: Article, select: '-__v' })
        .sort({ _id: -1 })
        .skip(querySkip)
        .limit(querylimit)
        .then((resp: any) => {
            result = resp;
            return Collect.find(query).countDocuments();
        }).then((resp: any) => {
            total = resp;
            SuccessMsg(res, { data: result.map((item: any) => item.articleId), total });
        });
}
