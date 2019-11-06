import { Follow } from '../model';
import { messageSave } from './message';
import {
    updateFollowCount,
    updateFansCount,
    updateTopicFollowCount
} from './common';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

// 关注人列表
export const followUserQuery  = (req: any, res: any) => {
    const { userId, currentPage, pageSize } = req.body;
    const query: any = { type: 0, userId };

    Follow.queryListLimit({ query, currentPage, pageSize }).then((resp: any) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 关注专题列表
export const followTopicQuery  = (req: any, res: any) => {
    const { userId, currentPage, pageSize } = req.body;
    const query: any = { type: 1, userId };

    Follow.queryListLimit({ query, currentPage, pageSize }).then((resp: any) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 关注标签列表
export const followTagQuery  = (req: any, res: any) => {
    const { userId, currentPage, pageSize } = req.body;
    const query: any = { type: 2, userId };

    Follow.queryListLimit({ query, currentPage, pageSize }).then((resp: any) => {
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

    Follow.queryListLimit({ query, currentPage, pageSize }).then((resp: any) => {
        SuccessMsg(res, { data: resp });
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
        let p = !resp ? Follow.save({ data }) : Follow.removeOne({ query });
        let msg = !resp ? '关注作者成功！' : '取消关注作者成功！';
        p.then(() => {
            return updateFollowCount(userId);
        }).then(() => {
            return updateFansCount(followUserId);
        }).then(() => {
            return messageSave({ fromUserId: userId, toUserId: followUserId, userId: followUserId, type: 2 });
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
        let p = !resp ? Follow.save({ data }) : Follow.removeOne({ query });
        let msg = !resp ? '关注专题成功！' : '取消关注专题成功！';
        p.then(() => {
            return updateFollowCount(userId);
        }).then(() => {
            return updateTopicFollowCount(followTopicId);
        }).then(() => {
            return messageSave({ fromUserId: userId, toUserId: followUserId, topicId: followTopicId, type: 3 });
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
        let p = !resp ? Follow.save({ data }) : Follow.removeOne({ query });
        let msg = !resp ? '关注标签成功！' : '取消关注标签成功！';
        p.then(() => {
            return updateFollowCount(userId);
        }).then(() => {
            SuccessMsg(res, { msg });
        }).catch(() => {
            ErrorMsg(res, {});
        });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}
