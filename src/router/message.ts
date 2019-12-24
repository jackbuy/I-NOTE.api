import { Message } from '../model';
import Utils from '../utils/utils';
import { emitConnected } from '../socket';
import { unreadMessageCount } from './common';
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

interface message{
    fromUserId: string;
    toUserId: string;
    targetId: string;
    type: number;
}

// 保存消息
export const messageSave = ({ fromUserId, toUserId, targetId, type }: message) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data: any = {
                fromUserId,
                toUserId,
                type
            }
            if (type === 0) data.likeId = targetId;
            if (type === 1) data.collectId = targetId;
            if (type === 2) data.userId = targetId;
            if (type === 3) data.topicId = targetId;
            if (type === 4) data.commentId = targetId;
            if (type === 5) data.replyId = targetId;
            // 过滤自己给自己发消息
            if (JSON.stringify(fromUserId) === JSON.stringify(toUserId)) return resolve();
            const result: any = await Message.findOne({ query: data });
            if (!result) {
                await Message.save({ data });
                const count: any = await unreadMessageCount(toUserId);
                emitConnected('UNREAD_MESSAGE_COUNT', toUserId, { count })
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
        const count: any = await unreadMessageCount(userId);
        emitConnected('UNREAD_MESSAGE_COUNT', userId, { count })
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
        const count: any = await unreadMessageCount(userId);
        emitConnected('UNREAD_MESSAGE_COUNT', userId, { count })
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
}