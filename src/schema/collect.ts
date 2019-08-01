import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default new Schema({ // 文章收藏
    articleId: { type: String },
    createUserId: { type: String },
    createTime: { type: Date, default: Date.now }
});