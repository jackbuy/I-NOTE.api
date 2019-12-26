import { Letter, LetterUser } from '../model';
import Utils from '../utils/utils';
import { unreadLetterCount } from './common';
import { emit, emitConnected } from '../socket';
const { SuccessMsg, ErrorMsg } = Utils;

// 私信列表- 分页查询
export const LetterQueryLimit = async (req: any, res: any) => {
    const { letterUserId } = req.body;

    let letterQuery: any = {
        letterUserId
    }

    try {
        const userList = await Letter.queryListLimit({ query: letterQuery });
        SuccessMsg(res, { data: userList });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 新增
export const LetterAdd = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { letterUserId, content } = req.body;

    let data: any = {
        letterUserId,
        userId,
        content,
        createTime: Date.now()
    };
    let letterUserQuery: any = {
        _id: letterUserId
    }
    let letterUserUpdate: any = null;

    try {
        let letterUser: any = await LetterUser.findOne({ query: letterUserQuery });
        if (!letterUser) return ErrorMsg(res, { msg: '对话不存在'});

        await Letter.save({ data });

        // 设置未读数量
        const { fromUserId, toUserId, fromUserLastReadTime, toUserLastReadTime } = letterUser;
        if (JSON.stringify(fromUserId) === JSON.stringify(userId)) {
            const count = await Letter.count({
                query: {
                    letterUserId,
                    createTime: { $gte: toUserLastReadTime }
                }
            });
            letterUserUpdate = {
                toUserUnreadCount: count
            }
        } else {
            const count = await Letter.count({
                query: {
                    letterUserId,
                    createTime: { $gt: fromUserLastReadTime }
                }
            });
            letterUserUpdate = {
                fromUserUnreadCount: count
            }
        }
        await LetterUser.updateOne({ query: letterUserQuery, update: letterUserUpdate});

        emit('NEW_LETTER', {
            type: 'letter',
            data: {
                letterUserId
            }
        });

        // 通知对方
        const _toUserId = JSON.stringify(toUserId) === JSON.stringify(userId) ? fromUserId : toUserId;
        const letterCount = await unreadLetterCount(_toUserId);
        emitConnected('UNREAD_LETTER_COUNT', _toUserId, { count: letterCount });

        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
}
