import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

export default new Schema({ // 文件管理
    originalName: { type: String }, // 原始文件名
    fileName: { type: String }, // 文件名
    mimetype: { type: String }, // 文件类型
    size: { type: Number, default: 0 }, // 文件大小
    createTime: { type: Date, default: Date.now },
    type: { type: String }, // 0 文章 1专题 2 头像
    articleId: { type: ObjectId, ref: 'Article' }, // 文章Id
    topicId: { type: ObjectId, ref: 'Topic' }, // 专题Id
    userAvatarId: { type: ObjectId, ref: 'User' }, // 用户头像Id
    userId: { type: ObjectId, ref: 'User' } // 用户Id
});