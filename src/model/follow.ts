import { Follow, User } from '../schema';
import { SuccessMsg, ErrorMsg, checkHasId } from '../utils/utils';

// 关注人列表
export const followUserQuery  = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const query = { userId };
    Follow
        .find(query, '-__v')
        .populate({ path: 'followId', model: User })
        .sort({ _id: -1 })
        .then((resp: any) => {
            SuccessMsg(res, { data: resp });
        });
}

// 粉丝列表
export const fansQuery  = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const query = { followId: userId };
    Follow
        .find(query, '-__v')
        .populate({ path: 'userId', model: User })
        .sort({ _id: -1 })
        .then((resp: any) => {
            SuccessMsg(res, { data: resp });
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
    checkHasId(res, User, followUserId).then(() => {
        if (userId === followUserId) return ErrorMsg(res, { msg: '自己不能关注自己！' });
        Follow.findOne({ userId, followId: followUserId }).then((resp: any) => {
            if (!resp) {
                new Follow(data).save().then(() => {
                    SuccessMsg(res, { msg: '关注成功！' });
                });
            } else {
                Follow.deleteOne({ followId: followUserId }).then(() => {
                    SuccessMsg(res, { msg: '取关成功！' });
                });
            }
        });
    });
}
