import { LetterUser, Letter } from '../model';
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
    // const queryCount = {
    // }
    try {
        let result: any = [];
        const userList = await LetterUser.queryListLimit({ query });

        // await userList.map(async (item: any) => {
        //     const count = await Letter.count({
        //         query: {
        //             createTime: {
        //                 $gte: item.readTime
        //             }
        //         }
        //     });
        //     item._doc.noReadCount = count;

        //     result.push(item);
        // });

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
