import { Collect, User, Article } from '../schema';
import { SuccessMsg, ErrorMsg } from '../utils/utils';

// 列表
export const collectQuery  = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const query = {createUserId: userId};
    Collect.find(query, 'articleId')
    // .populate({path: 'createUserId', model: User, select: 'username'})
    .populate({path: 'articleId', model: Article})
    .sort({ _id: -1 })
    .then((resp: any) => {
        SuccessMsg( res, { data: resp} );
    });
}
