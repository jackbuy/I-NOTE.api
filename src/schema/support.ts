import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default new Schema({ // 点赞
    articleId: { type: String },
    createUserId: { type: String },
    createTime: { type: Date, default: Date.now }
});
