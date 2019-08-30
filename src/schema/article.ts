import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

export default new Schema({ //文章
    title: { type: String },
    contentText: { type: String },
    contentHtml: { type: String },
    publish: { type: Boolean, default: false }, // 是否发布
    top: { type: Boolean, default: false}, // 置顶
    viewCount: { type: Number, default: 0 }, // 阅读数量
    isLike: { type: Boolean, default: false }, // 是否点赞
    likeCount: { type: Number, default: 0 }, // 点赞数量
    isCollect: { type: Boolean, default: false }, // 是否已收藏
    collectCount: { type: Number, default: 0 }, // 收藏数量
    tagId: { type: ObjectId, ref: 'Tag' },
    userId: { type: ObjectId, ref: 'User' },
    createTime: { type: Date, default: Date.now },
    editTime: { type: Date, default: Date.now }
});