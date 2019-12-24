import { Comment } from '../model';
import Utils from '../utils/utils';
import { updateArticleCommentCount } from './common';
import { messageSave } from './message';
const { SuccessMsg, ErrorMsg } = Utils;

// 查询
export const commentQuery = async (req: any, res: any) => {
    const { articleId } = req.body;
    const query: any = {
        articleId,
        parentId: null
    }
    const querySort: any = {
        _id: 1
    }

    try {
        const result: any = await Comment.queryListLimit({ query, querySort });
        SuccessMsg(res, { data: result });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 我的评论
export const commentUserQuery = async (req: any, res: any) => {
    const { userId, currentPage, pageSize, } = req.body;
    const query: any = {
        commentUserId: userId,
        parentId: null
    }
    const querySort: any = {
        _id: 1
    }

    try {
        const result: any = await Comment.queryUserListLimit({ query, querySort, currentPage, pageSize });
        SuccessMsg(res, { data: result });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 保存
export const commentSave = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { articleId, authorId } = req.body;
    const data: any = {
        ...req.body,
        commentUserId: userId,
        createTime: Date.now()
    }

    try {
        await Comment.save({ data });
        await updateArticleCommentCount(req.body.articleId);
        await messageSave({ fromUserId: userId, toUserId: authorId, targetId: articleId, type: 4 });
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 回复
export const commentReply = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { articleId, replyUserId } = req.body;
    const data: any = {
        ...req.body,
        commentUserId: userId,
        createTime: Date.now()
    }

    try {
        const result: any = await Comment.save({ data });

        const query: any = { _id: req.body.parentId };
        const update: any = { $push: { reply: result._id }};
        await Comment.updateOne({ query, update });
        await updateArticleCommentCount(req.body.articleId);
        await messageSave({ fromUserId: userId, toUserId: replyUserId, targetId: articleId, type: 5 });

        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 删除评论
export const commentDelete = async (req: any, res: any) => {
    const { commentId } = req.params;
    const query: any = {
        _id: commentId
    }

    try {
        const isHas: any = await Comment.findOne({ query });
        if (!isHas) return ErrorMsg(res, { msg: '评论内容不存在' });

        const { _id, parentId } = isHas;

        // 如存在子级， 则删除子级
        if (!parentId) {
            const children: any = Comment.find({ query: { parentId: _id } });
            for await (let item of children) {
                Comment.removeOne({ query: { parentId: _id } });
            }
        }

        await Comment.removeOne({ query });

        await updateArticleCommentCount(req.body.articleId);

        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
}