import Follow from '../model/follow';
import { updateFollowCount, updateFansCount } from './user';
import { messageSave } from './message';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

const setVal = (arr1: any, arr2: any, type: string) => {
    let arr: any = [];
    arr1.map((item: any) => {
        arr2.map((item2: any) => {
            if (item.userId._id == item2.followId && item.followId == item2.followId) item[type] = true;
        });
        arr.push(item);
    });
    return arr;
}

// 关注人列表
export const followUserQuery  = (req: any, res: any) => {
    const { userId, currentPage, pageSize } = req.body;
    const query: any = { type: 0, userId };
    const select: string = '-__v';
    const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
    const querylimit: number = parseInt(pageSize);

    Follow.followUserQueryLimit({ query, select, querySkip, querylimit }).then((resp: any) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 关注专题列表
export const followTopicQuery  = (req: any, res: any) => {
    const { userId, currentPage, pageSize } = req.body;
    const query: any = { type: 1, userId };
    const select: string = '-__v';
    const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
    const querylimit: number = parseInt(pageSize);

    Follow.followTopicQueryLimit({ query, select, querySkip, querylimit }).then((resp: any) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 关注标签列表
export const followTagQuery  = (req: any, res: any) => {
    const { userId, currentPage, pageSize } = req.body;
    const query: any = { type: 2, userId };
    const select: string = '-__v';
    const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
    const querylimit: number = parseInt(pageSize);

    Follow.followTagQueryLimit({ query, select, querySkip, querylimit }).then((resp: any) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 粉丝列表
export const fansQuery  = (req: any, res: any) => {
    const { userId, currentPage, pageSize } = req.body;
    const query: any = {
        followUserId: userId,
        type: 0
    };
    const select: string = '-__v';
    const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
    const querylimit: number = parseInt(pageSize);

    const p1 = Follow.fansQueryLimit({ query, select, querySkip, querylimit });
    const p2 = Follow.find({ query: { userId } });

    Promise.all([ p1, p2 ]).then((resp) => {
        let result: any = [];
        result = setVal(resp[0], resp[1], 'isFollow');
        SuccessMsg(res, { data: result });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 关注人
export const followUser = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { followUserId } = req.body;
    const query: any = {
        userId,
        followUserId,
    };
    const data: any = {
        ...query,
        type: 0,
        createTime: Date.now()
    };

    Follow.findOne({ query }).then((resp: any) => {
        let p = !resp ? Follow.save(data) : Follow.removeOne(query);
        let msg = !resp ? '关注作者成功！' : '取消关注作者成功！';
        p.then(() => {
            return updateFollowCount(userId);
        }).then(() => {
            return updateFansCount(userId);
        }).then(() => {
            return  messageSave({ fromUserId: userId, toUserId: followUserId, userId: followUserId, type: 2 });
        }).then(() => {
            SuccessMsg(res, { msg });
        }).catch(() => {
            ErrorMsg(res, {});
        });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 关注专题
export const followTopic = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { followTopicId, followUserId } = req.body;
    const query: any = {
        userId,
        followTopicId,
    };
    const data: any = {
        ...query,
        type: 1,
        createTime: Date.now()
    };

    Follow.findOne({ query }).then((resp: any) => {
        let p = !resp ? Follow.save(data) : Follow.removeOne(query);
        let msg = !resp ? '关注专题成功！' : '取消关注专题成功！';
        p.then(() => {
            return updateFollowCount(userId);
        }).then(() => {
            return updateFansCount(userId);
        }).then(() => {
            return  messageSave({ fromUserId: userId, toUserId: followUserId, topicId: followTopicId, type: 3 });
        }).then(() => {
            SuccessMsg(res, { msg });
        }).catch(() => {
            ErrorMsg(res, {});
        });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 关注标签
export const followTag = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { followTagId } = req.body;
    const query: any = {
        userId,
        followTagId,
    };
    const data: any = {
        ...query,
        type: 2,
        createTime: Date.now()
    };

    Follow.findOne({ query }).then((resp: any) => {
        let p = !resp ? Follow.save(data) : Follow.removeOne(query);
        let msg = !resp ? '关注标签成功！' : '取消关注标签成功！';
        p.then(() => {
            return updateFollowCount(userId);
        }).then(() => {
            return updateFansCount(userId);
        }).then(() => {
            SuccessMsg(res, { msg });
        }).catch(() => {
            ErrorMsg(res, {});
        });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}
