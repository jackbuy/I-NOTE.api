import { Comment } from '../model';
import Utils from '../utils/utils';
import { updateArticleCommentCount } from './common';
const { SuccessMsg, ErrorMsg } = Utils;

// 查询
export const commentQuery = (req: any, res: any) => {
    const { articleId } = req.body;
    const query: any = {
        articleId,
        parentId: null
    }
    const querySort: any = {
        _id: 1
    }
    Comment.queryListLimit({ query, querySort }).then((resp: any) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    })
}

// 我的评论
export const commentUserQuery = (req: any, res: any) => {
    const { userId, currentPage, pageSize, } = req.body;
    const query: any = {
        commentUserId: userId,
        parentId: null
    }
    const querySort: any = {
        _id: 1
    }
    Comment.queryUserListLimit({ query, querySort, currentPage, pageSize }).then((resp: any) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    })
}

// 保存
export const commentSave = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const data: any = {
        ...req.body,
        commentUserId: userId,
        createTime: Date.now()
    }
    Comment.save({ data }).then(() => {
        return updateArticleCommentCount(req.body.articleId);
    }).then(() => {
        SuccessMsg(res, {});
    }).catch(() => {
        ErrorMsg(res, {});
    })
}

// 回复
export const commentReply = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const data: any = {
        ...req.body,
        commentUserId: userId,
        createTime: Date.now()
    }
    const commentSave = Comment.save({ data });

    commentSave.then((resp: any) => {
        const query: any = { _id: req.body.parentId };
        const update: any = { $push: { reply: resp._id }};
        return Comment.updateOne({ query, update });
    }).then(() => {
        return updateArticleCommentCount(req.body.articleId);
    }).then(() => {
        SuccessMsg(res, {});
    }).catch(() => {
        ErrorMsg(res, {});
    })
}

// 删除评论
export const commentDelete = (req: any, res: any) => {
    const { commentId } = req.params;
    const query: any = {
        _id: commentId
    }

    Comment.findOne({ query }).then((resp: any) => {
        if (!resp) ErrorMsg(res, { msg: '评论内容不存在' });
        const { _id, parentId } = resp;
        // 如存在子级， 则删除子级
        if (!parentId) {
            Comment.find({ query: { parentId: _id } }).then((resp: any) => {
                let promises = resp.map((item: any) => {
                    return Comment.removeOne({ query: { parentId: _id } })
                });
                return Promise.all(promises);
            })
        } else {
            Promise.resolve();
        }
    }).then(() => {
        return Comment.removeOne({ query })
    }).then(() => {
        return updateArticleCommentCount(req.body.articleId);
    }).then(() => {
        SuccessMsg(res, {});
    }).catch(() => {
        ErrorMsg(res, {});
    });
}