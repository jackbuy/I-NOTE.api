import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default new Schema({ //文章
    title: { type: String },
    contentText: { type: String },
    contentHtml: { type: String },
    publish: { type: Boolean, default: false }, // 是否发布
    top: { type: Boolean, default: false}, // 置顶
    supportCount: { type: Number, default: 0 }, // 点赞数量
    viewCount: { type: Number, default: 0 }, // 阅读数量
    collectCount: { type: Number, default: 0 }, // 收藏数量
    isSupport: { type: Boolean, default: false }, // 是否已赞
    isCollect: { type: Boolean, default: false }, // 是否已收藏
    isFollow: { type: Boolean, default: false }, // 是否已关注
    commentCount: { type: Number, default: 0 }, // 评论数量
    tagId: { type: String, default: ''},
    userId: { type: String },
    createTime: { type: Date, default: Date.now },
    editTime: { type: Date, default: Date.now }
});