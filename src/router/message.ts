import Message from '../model/message';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

export const messageQuery = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { isRead, type, currentPage = 1, pageSize = 10 } = req.body;
    let query: any = { toUserId: userId };
    const select: string = '-__v';
    const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
    const querylimit: number = parseInt(pageSize);
    if (type) query.type = type;
    if (isRead) query.isRead = isRead;

    Message.queryLimit({ query, select, querySkip, querylimit }).then((resp: any) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 保存消息
export const messageSave = (data: any) => {
    return new Promise((resolve, reject) => {
        Message.findOne({ query: data }).then((resp: any) => {
            if (!resp) Message.save({ ...data });
            resolve();
        }).catch(() => {
            reject();
        });
    });
}