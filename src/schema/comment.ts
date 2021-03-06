
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

export default new Schema({ // 评论
    content: { type: String },
    articleId: { type: ObjectId, ref: 'ArticlePublish' },
    authorId: { type: ObjectId, ref: 'User' }, // 文章作者Id
    commentUserId: { type: ObjectId, ref: 'User' }, // 评论者Id
    replyUserId: { type: ObjectId, ref: 'User' }, // 互评者Id
    parentId: { type: ObjectId, default: null },
    reply: [{ type: ObjectId, ref: 'Comment' }], // 回复Ids
    createTime: { type: Date, default: Date.now }
});
