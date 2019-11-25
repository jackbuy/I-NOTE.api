import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

export default new Schema({ // 私信
    letterUserId: { type: ObjectId, ref: 'LetterUser' }, // 用户对话Id
    content: { type: String }, // 内容
    userId: { type: String }, // 发信人Id
    createTime: { type: Date, default: Date.now } // 创建时间
});