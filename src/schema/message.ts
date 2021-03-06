import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

export default new Schema({ // 消息
    isRead: { type: Boolean, default: false },
    fromUserId: { type: ObjectId, ref: 'User' }, // 我
    toUserId: { type: ObjectId, ref: 'User' },
    likeId: { type: ObjectId, ref: 'ArticlePublish' }, // 点赞Id
    collectId: { type: ObjectId, ref: 'ArticlePublish' }, // 收藏Id
    commentId: { type: ObjectId, ref: 'ArticlePublish' }, // 评论Id
    replyId: { type: ObjectId, ref: 'ArticlePublish' }, // 回复Id
    userId: { type: ObjectId, ref: 'User' }, // 关注人Id
    topicId: { type: ObjectId, ref: 'Topic' }, // 关注专题Id
    type: { type: Number, default: 0 }, // 类型 0(点赞) 1(收藏) 2(关注人) 3(关注专题) 4(评论) 5(回复)
    createTime: { type: Date, default: Date.now }
});