import { Follow, User } from '../schema';
import { SuccessMsg, ErrorMsg } from '../utils/utils';

// 关注人列表
export const followUserQuery  = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const query = {userId: userId};
    Follow.find(query, '-__v')
    .populate({path: 'followId', model: User})
    .sort({ _id: -1 })
    .then((resp: any) => {
        SuccessMsg( res, { data: resp} );
    });
}

// 粉丝列表
export const fansQuery  = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const query = {followId: userId};
    Follow.find(query, '-__v')
    .populate({path: 'userId', model: User})
    .sort({ _id: -1 })
    .then((resp: any) => {
        SuccessMsg( res, { data: resp} );
    });
}

// 关注人
export const followUser = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { followUserId } = req.params;
    const data: any = {
        userId,
        followId: followUserId,
        type: 0,
        createTime: Date.now()
    };
    new Follow(data).save()
        .then(() => {
            SuccessMsg( res, {} );
        })
        .catch((err: any) => {
            ErrorMsg(res, {msg: err});
        });
}
