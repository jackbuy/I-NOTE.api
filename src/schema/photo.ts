import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

export default new Schema({ // 图片管理
    name: { type: String },
    url: { type: String },
    type: { type: Number, default: 0 }, // 0（专题封面）
    createTime: { type: Date, default: Date.now },
    userId: { type: ObjectId, ref: 'UserId' }
});