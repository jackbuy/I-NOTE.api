import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default new Schema({ // 图片管理
    userId: { type: String },
    fromId: { type: String }, // 图片来源Id
    img: { type: String }, // 图片名称
    type: { type: Number, default: 0 }, // 0（文章）， 1（用户头像）
    createTime: { type: Date, default: Date.now }
});