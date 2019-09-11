import { Collect, Like } from '../model';
import Utils from '../utils/utils';
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
export const collectDelete = (req: any, res: any) => {
    const { collectId } = req.params;
    const query: any = {
        _id: collectId
    }

    Collect.removeOne({ query }).then((resp) => {
        SuccessMsg(res, {});
    }).catch(() => {
        ErrorMsg(res, {});
    });
}