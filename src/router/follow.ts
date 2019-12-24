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
export const followUserQuery = async (req: any, res: any) => {
    const { userId, currentPage, pageSize } = req.body;
    const query: any = { type: 0, userId };

    try {
        const result: any = await Follow.queryListLimit({ query, currentPage, pageSize });
        SuccessMsg(res, { data: result });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 关注专题列表
export const followTopicQuery = async (req: any, res: any) => {
    const { userId, currentPage, pageSize } = req.body;
    const query: any = { type: 1, userId };

    try {
        const result: any = await Follow.queryListLimit({ query, currentPage, pageSize });
        SuccessMsg(res, { data: result });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 关注标签列表
export const followTagQuery = async (req: any, res: any) => {
    const { userId, currentPage, pageSize } = req.body;
    const query: any = { type: 2, userId };

    try {
        const result: any = await Follow.queryListLimit({ query, currentPage, pageSize });
        SuccessMsg(res, { data: result });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 粉丝列表
export const fansQuery = async (req: any, res: any) => {
    const { userId, currentPage, pageSize } = req.body;
    const query: any = {
        followUserId: userId,
        type: 0
    };

    try {
        const result: any = await Follow.queryListLimit({ query, currentPage, pageSize });
        SuccessMsg(res, { data: result });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 关注人
export const followUser = async (req: any, res: any) => {
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

    try {
        const isHas: any = await Follow.findOne({ query });
        let msg = !isHas ? '关注作者成功！' : '取消关注作者成功！';
        !isHas ? await Follow.save({ data }) : await Follow.removeOne({ query });
        await updateFollowCount(userId);
        await updateFansCount(followUserId);
        await messageSave({ fromUserId: userId, toUserId: followUserId, targetId: followUserId, type: 2 });
        SuccessMsg(res, { data: msg });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 关注专题
export const followTopic = async (req: any, res: any) => {
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

    try {
        const isHas: any = await Follow.findOne({ query });
        let msg = !isHas ? '关注专题成功！' : '取消关注专题成功！';
        !isHas ? await Follow.save({ data }) : await Follow.removeOne({ query });
        await updateFollowCount(userId);
        await updateTopicFollowCount(followTopicId);
        await messageSave({ fromUserId: userId, toUserId: followUserId, targetId: followTopicId, type: 3 });
        SuccessMsg(res, { data: msg });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 关注话题（标签）
export const followTag = async (req: any, res: any) => {
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

    try {
        const isHas: any = await Follow.findOne({ query });
        let msg = !isHas ? '关注话题成功！' : '取消关注话题成功！';
        !isHas ? await Follow.save({ data }) : await Follow.removeOne({ query });
        await updateFollowCount(userId);
        SuccessMsg(res, { data: msg });
    } catch(e) {
        ErrorMsg(res, {});
    }
}
