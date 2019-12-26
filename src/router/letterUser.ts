import { LetterUser } from '../model';
import Utils from '../utils/utils';
import { unreadLetterCount } from './common';
import { emitConnected } from '../socket';
const { SuccessMsg, ErrorMsg } = Utils;

// 私信联系人列表- 分页查询
export const LetterUserQueryLimit = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const query = {
        $or: [
            { $and: [
                { fromUserId: userId }
            ] },
            { $and: [
                { toUserId: userId }
            ] }
        ]
    }

    try {
        const userList = await LetterUser.queryListLimit({ query });
        SuccessMsg(res, { data: userList });
    } catch(e) {
        ErrorMsg(res, {});
    }
}


// 清除自己未读私信
export const clearLetterUserCount = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { letterUserId } = req.body;

    let letterUserQuery: any = {
        _id: letterUserId
    }
    let letterUserUpdate: any = null;

    try {
        let letterUser: any = await LetterUser.findOne({ query: letterUserQuery });
        if (!letterUser) return ErrorMsg(res, { msg: '私信对话不存在'});
        // 设置最后阅读时间
        const { fromUserId } = letterUser;
        if (JSON.stringify(fromUserId) === JSON.stringify(userId)) {
            letterUserUpdate = {
                fromUserUnreadCount: 0,
                fromUserLastReadTime: Date.now()
            }
        } else {
            letterUserUpdate = {
                toUserUnreadCount: 0,
                toUserLastReadTime: Date.now()
            }
        }
        // 更新用户统计数据
        await LetterUser.updateOne({ query: letterUserQuery, update: letterUserUpdate});

        // 通知自己
        const letterCount = await unreadLetterCount(userId);
        emitConnected('UNREAD_LETTER_COUNT', userId, { count: letterCount });

        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
}


// 私信联系人 - 新增、编辑
export const LetterUserAdd = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { toUserId } = req.params;
    const query: any = {
        $or: [
            {
                $and: [
                    { fromUserId: userId },
                    { toUserId: toUserId }
                ]
            },
            {
                $and: [
                    { fromUserId: toUserId },
                    { toUserId: userId }
                ]
            }
        ]
    }
    const data = {
        fromUserId: userId,
        toUserId,
        createTime: Date.now()
    }

    try {
        // 检查私信列表是否已存在
        const isHas = await LetterUser.findOne({ query });
        let addUser = {};
        if (!isHas) {
            addUser = await LetterUser.save({ data });
        }
        SuccessMsg(res, { data: isHas ? isHas : addUser });
    } catch(e) {
        ErrorMsg(res, {});
    }
}
