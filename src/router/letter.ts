import { Letter, LetterUser } from '../model';
import Utils from '../utils/utils';
// import { emit } from '../socket';
const { SuccessMsg, ErrorMsg } = Utils;

// 私信列表- 分页查询
export const LetterQueryLimit = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { letterUserId } = req.body;

    const query = {
        letterUserId
    }

    try {
        const userList = await Letter.queryListLimit({ query });
        SuccessMsg(res, { data: userList });
    } catch(e) {
        ErrorMsg(res, {});
    }
}


// 新增
export const LetterAdd = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { letterUserId, content } = req.body;
    const data: any = {
        letterUserId,
        userId,
        content,
        createTime: Date.now()
    };

    try {
        await Letter.save({ data });
        // const users: any = await LetterUser.findOne({ query: { _id: letterUserId } });
        // if (users) {
        //     emit('MSG', { type: 'newLetter' });
        // }
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
}