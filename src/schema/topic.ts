import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

export default new Schema({ // 专题
    title: { type: String }, // 名称
    description: { type: String }, // 描述
    img: { type: String, default: '' }, // 封面
    isFollow: { type: Boolean, default: false },
    userId: { type: ObjectId, ref: 'User' },
    articleIds: { type: String, default: '' },
    createTime: { type: Date, default: Date.now } // 创建时间
});