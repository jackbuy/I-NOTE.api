import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default new Schema({ // 消息
    isRead: { type: Boolean, default: false },
    createUserId: { type: String },
    receiveUserId: { type: String },
    /**
     * type 消息类型
     * 
     * 1（点赞）
     * 2（收藏）
     * 3（关注人）
     * 4（关注专题）
     */
    type: { type: Number },
    relativeId: { type: String }, // 关联id,和type搭配使用
    createTime: { type: Date, default: Date.now }
});