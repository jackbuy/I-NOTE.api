import { Message } from '../model';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

export const messageQuery = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { isRead, type, currentPage, pageSize } = req.body;
    let query: any = { toUserId: userId };
    if (type) query.type = type;
    if (isRead) query.isRead = isRead;

    Message.queryListLimit({ query, currentPage, pageSize }).then((resp: any) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 保存消息
export const messageSave = (data: any) => {
    return new Promise((resolve, reject) => {
        Message.findOne({ query: data }).then((resp: any) => {
            if (!resp) Message.save({ data });
            resolve();
        }).catch(() => {
            reject();
        });
    });
}