import { Message } from '../model';
import Utils from '../utils/utils';
import { emit } from '../socket'
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
        const { toUserId } = data;
        Message.findOne({ query: data }).then((resp: any) => {
            if (!resp) {
                Message.save({ data });
                emit('NEW_MSG', {
                    type: 'newMsg',
                    data: {
                        toUserId
                    }
                });
            }
            resolve();
        }).catch(() => {
            reject();
        });
    });
}

// 是否有新消息
export const newMessage  = (req: any, res: any) => {
    const { toUserId } = req.body;
    const query: any = { toUserId, isRead: false };
    Message.count({ query: query }).then((resp) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 标记为已读
export const messageRead  = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { messageId } = req.params;
    const update: any = {
        isRead: true
    };
    const query: any = { _id: messageId };
    
    Message.updateOne({ query, update }).then(() => {
        emit('NEW_MSG', {
            type: 'newMsg',
            data: {
                toUserId: userId
            }
        });
        SuccessMsg(res, {});
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 删除
export const messageDelete  = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { messageId } = req.params;
    const query = { _id: messageId };
    Message.removeOne({ query }).then(() => {
        emit('NEW_MSG', {
            type: 'newMsg',
            data: {
                toUserId: userId
            }
        });
        SuccessMsg(res, {});
    }).catch(() => {
        ErrorMsg(res, {});
    });
}