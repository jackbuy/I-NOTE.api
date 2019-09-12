import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

export default new Schema({ // 文件管理
    name: { type: String }, // 原始文件名
    fileName: { type: String }, // 文件名
    mimetype: { type: String }, // 文件类型
    type: { type: Number, default: 0 }, // 0 图片
    size: { type: Number, default: 0 }, // 文件大小
    createTime: { type: Date, default: Date.now },
    userId: { type: ObjectId, ref: 'UserId' }
});