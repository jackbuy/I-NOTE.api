import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

export default new Schema({ // 文章收藏
    articleId: { type: ObjectId, ref: 'ArticlePublish' },
    articleTitle: { type: String },
    createUserId: { type: ObjectId, ref: 'User' },
    createTime: { type: Date, default: Date.now }
});