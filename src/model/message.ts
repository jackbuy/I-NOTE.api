import { Message, User, Article } from '../schema';
import { SuccessMsg, ErrorMsg } from '../utils/utils';

// 消息列表
export const messageQuery  = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const query = { receiveUserId: userId };
    Message
        .find(query, '-__v')
        .populate({ path: 'createUserId', model: User, select: 'username' })
        .populate({ path: 'receiveUserId', model: User, select: 'username' })
        .populate({ path: 'articleId', model: Article, select: 'title' })
        .sort({_id: -1})
        .then((resp: any) => {
            SuccessMsg(res, { data: resp });
        });
}
