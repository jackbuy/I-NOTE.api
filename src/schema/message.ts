import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default new Schema({ // 消息
    isRead: { type: Boolean, default: false },
    articleId: { type: String },
    createUserId: { type: String },
    receiveUserId: { type: String },
    /**
     * type 消息类型
     * 
     * 1（收藏） 2（取消收藏）
     * 3（关注） 4（取消关注）
     * 5（点赞） 6（取消点赞）
     */
    type: { type: Number },
    createTime: { type: Date, default: Date.now }
});