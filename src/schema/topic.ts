import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default new Schema({ // 专题
    title: { type: String }, // 名称
    description: { type: String }, // 描述
    img: { type: String }, // 封面
    userId: { type: String }, // 创建者
    isFollow: { type: Boolean, default: false },
    articleIds: { type: String, default: '' }, // 专题相关的文章列表
    createTime: { type: Date, default: Date.now } // 创建时间
});