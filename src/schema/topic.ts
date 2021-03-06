import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

export default new Schema({ // 专题
    title: { type: String }, // 名称
    description: { type: String }, // 描述
    img: { type: String, default: '' }, // 封面
    userId: { type: ObjectId, ref: 'User' },
    // manageUserIds: [{ type: ObjectId, ref: 'User' }], // 管理员列表
    followCount: { type: Number, default: 0 }, // 关注数量
    articleCount: { type: Number, default: 0 }, // 文章数量
    createTime: { type: Date, default: Date.now } // 创建时间
});