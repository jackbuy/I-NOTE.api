import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

export default new Schema({ // 私信用户
    fromUserId: { type: ObjectId, ref: 'User' }, // 发起者
    toUserId: { type: ObjectId, ref: 'User' }, // 接收者
    fromUserUnreadCount: { type: Number, default: 0 }, // 发起者未读数量
    fromUserLastReadTime: { type: Date, default: Date.now }, // 发起者最后查看时间
    toUserUnreadCount: { type: Number, default: 0 }, // 接收着未读数量
    toUserLastReadTime: { type: Date, default: Date.now }, // 接收者最后查看时间
    createTime: { type: Date, default: Date.now } // 对话创建时间
});