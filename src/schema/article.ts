import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default new Schema({ //文章
    title: { type: String },
    contentText: { type: String },
    contentHtml: { type: String },
    tagName: { type: String, default: ''},
    publish: { type: Boolean, default: false },
    supportCount: { type: Number, default: 0 },
    isSupport: { type: Boolean, default: false }, // 是否已赞
    viewCount: { type: Number, default: 0 },
    collectCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    userId: { type: String },
    createTime: { type: Date, default: Date.now },
    editTime: { type: Date, default: Date.now }
});
