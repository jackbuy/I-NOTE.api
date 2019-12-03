import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

export default new Schema({ // 私信用户
    fromUserId: { type: ObjectId, ref: 'User' },
    toUserId: { type: ObjectId, ref: 'User' },
    createTime: { type: Date, default: Date.now }, // 创建时间
    readTime: { type: Date, default: Date.now } // 查看时间
});