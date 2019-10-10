import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

export default new Schema({ // 专题
    title: { type: String }, // 名称
    description: { type: String }, // 描述
    img: { type: String, default: '' }, // 封面
    isFollow: { type: Boolean, default: false }, // 是否已关注
    isTopic: { type: Boolean, default: false }, // 是否已加入专题
    userId: { type: ObjectId, ref: 'User' },
    followCount: { type: Number, default: 0 }, // 关注数量
    articleCount: { type: Number, default: 0 }, // 文章数量
    createTime: { type: Date, default: Date.now } // 创建时间
});