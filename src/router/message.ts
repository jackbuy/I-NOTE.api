import { Message } from '../model';
import Utils from '../utils/utils';
import { emit } from '../socket';
import { getNewMessageCount } from './common';
const { SuccessMsg, ErrorMsg } = Utils;


// 列表
export const messageQuery = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { isRead, type, currentPage, pageSize } = req.body;
    let query: any = { toUserId: userId };
    if (type) query.type = type;
    if (isRead) query.isRead = isRead;

    try {
        const result: any = await Message.queryListLimit({ query, currentPage, pageSize });
        SuccessMsg(res, { data: result });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 保存消息
export const messageSave = (data: any): Promise<object> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { toUserId } = data;
            const result: any = await Message.findOne({ query: data });
            if (!result) {
                await Message.save({ data });
                const count: any = await getNewMessageCount(toUserId);
                emit('NEW_MSG', {
                    type: 'newMsg',
                    data: {
                        toUserId,
                        msgCount: count
                    }
                });
            }
            resolve();
        } catch(e) {
            reject();
        }
    });
}

// 标记为已读
export const messageRead = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { messageId } = req.params;
    const update: any = {
        isRead: true
    };
    const query: any = { _id: messageId };

    try {
        await Message.updateOne({ query, update });
        const count: any = await getNewMessageCount(userId);
        emit('NEW_MSG', {
            type: 'newMsg',
            data: {
                toUserId: userId,
                msgCount: count
            }
        });
        SuccessMsg(res, {});
    } catch {
        ErrorMsg(res, {});
    }
}

// 删除
export const messageDelete = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { messageId } = req.params;
    const query: any = { _id: messageId };

    try {
        await Message.removeOne({ query });
        const count: any = await getNewMessageCount(userId);
        emit('NEW_MSG', {
            type: 'newMsg',
            data: {
                toUserId: userId,
                msgCount: count
            }
        });
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
}