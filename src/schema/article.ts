import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const articleSchema = new Schema({ //文章
    title: { type: String },
    contentHtml: { type: String },
    isPublish: { type: Boolean, default: false }, // 是否已发布
    articlePublishId: { type: ObjectId, ref: 'article' }, // 发布文章Id
    tagId: { type: ObjectId, ref: 'Tag' },
    userId: { type: ObjectId, ref: 'User' },
    createTime: { type: Date, default: Date.now },
    editTime: { type: Date, default: Date.now }
});

export default articleSchema;