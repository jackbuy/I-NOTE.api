import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default new Schema({ // 消息
    isRead: { type: Boolean, default: false },
    articleId: { type: String },
    createUserId: { type: String },
    receiveUserId: { type: String },
    type: { type: Number }, // 消息类型 0（点赞）、1（收藏）
    createTime: { type: Date, default: Date.now }
});