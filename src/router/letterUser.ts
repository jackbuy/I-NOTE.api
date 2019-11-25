import { LetterUser } from '../model';
import Utils from '../utils/utils';
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

// 私信联系人 - 新增、编辑
export const LetterUserAdd = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { toUserId } = req.params;

    const query: any = {
        $or: [
            { $and: [
                { fromUserId: userId },
                { toUserId: toUserId }
            ] },
            { $and: [
                { fromUserId: toUserId },
                { toUserId: userId }
            ] }
        ]
    }

    const data = {
        fromUserId: userId,
        toUserId,
        createTime: Date.now()
    }

    try {

        // 检查是否存在
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
