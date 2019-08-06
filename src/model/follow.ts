import { Follow, User, Message } from '../schema';
import { SuccessMsg, ErrorMsg, checkHasId } from '../utils/utils';

/**
 * 关注列表
 * @param type 关注类型 0（关注人）、1（关注专题）、2（关注标签）
 * @param userId 
 */
export const followQuery  = (req: any, res: any) => {
    const { userId, type } = req.body;
    const query = {
        type,
        userId
    };
    Follow
        .find(query, '-__v')
        .sort({ _id: -1 })
        .populate({path: 'followId', model: User, select: 'username'})
        .then((resp: any) => {
            SuccessMsg(res, { data: resp });
        });
}

// 粉丝列表
export const fansQuery  = (req: any, res: any) => {
    const { userId, type } = req.body;
    const query = {
        followId: userId,
        type
    };
    let fansList: any = [];
    let followList: any = [];
    Follow
        .find(query, '-__v')
        .populate({ path: 'userId', model: User })
        .sort({ _id: -1 })
        .then((resp: any) => {
            fansList = resp;
            return Follow.find({ userId });
        })
        .then((resp: any) => {
            followList = resp;
        })
        .then(() => {
            fansList.map((item1: any) => {
                followList.map((item2: any) => {
                    if (item1.userId._id == item2.followId && item1.followId == item2.followId) item1.isFollow = true;
                });
            });
            SuccessMsg(res, { data: fansList });
        });
}

// 关注(人、专题、标签)
export const follow = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { followId, type } = req.body;
    const data: any = {
        userId,
        followId,
        type,
        createTime: Date.now()
    };
    Follow.findOne({ userId, followId, type }).then((resp: any) => {
        if (!resp) {
            new Follow(data).save().then(() => {
                SuccessMsg(res, { msg: '关注成功！' });
            });
        } else {
            Follow.deleteOne({ userId, followId }).then(() => {
                SuccessMsg(res, { msg: '取消关注成功！' });
            });
        }
    });
    // 保存消息
    // let msgData: any = {
    //     createUserId: userId,
    //     receiveUserId: followUserId
    // };
    // checkHasId(res, User, followUserId).then(() => {
    //     if (userId === followUserId && followType === 0) return ErrorMsg(res, { msg: '自己不能关注自己！' });
    //     Follow.findOne({ userId, followId: followUserId }).then((resp: any) => {
    //         if (!resp) {
    //             new Follow(data).save().then(() => {
    //                 msgData.type = 3;
    //                 return new Message(msgData).save();
    //             }).then(() => {
    //                 SuccessMsg(res, { msg: '关注成功！' });
    //             });
    //         } else {
    //             Follow.deleteOne({ userId, followId: followUserId }).then(() => {
    //                 msgData.type = 4;
    //                 return new Message(msgData).save();
    //             }) .then(() => {
    //                 SuccessMsg(res, { msg: '取消关注成功！' });
    //             });
    //         }
    //     });
    // });
}
