import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const articleSchema = new Schema({ // 发布的文章
    title: { type: String },
    contentHtml: { type: String },
    articleId: { type: ObjectId, ref: 'ArticlePublish' }, // 文章Id
    // articleCateId: { type: ObjectId, ref: 'articleCate' }, // 文章分类Id
    tagId: { type: ObjectId, ref: 'Tag' },
    userId: { type: ObjectId, ref: 'User' },
    likeCount: { type: Number, default: 0 }, // 点赞数量
    viewCount: { type: Number, default: 0 }, // 阅读数量
    collectCount: { type: Number, default: 0 }, // 收藏数量
    commentCount: { type: Number, default: 0 }, // 评论数量
    publishTime: { type: Date, default: Date.now }
});

articleSchema.index({ publish: 1, viewCount: 1 });
articleSchema.index({ publish: 1, editTime: 1 });
articleSchema.index({ publish: 1, userId: 1 });

export default articleSchema;