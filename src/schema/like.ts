import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

export default new Schema({ // 点赞/喜欢
    articleId: { type: ObjectId, ref: 'ArticlePublish' },
    createUserId: { type: ObjectId, ref: 'User' },
    createTime: { type: Date, default: Date.now }
});
