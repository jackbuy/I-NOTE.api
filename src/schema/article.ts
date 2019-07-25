import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default new Schema({ //文章
    title: { type: String },
    contentText: { type: String },
    contentHtml: { type: String },
    tagName: { type: String, default: ''},
    publish: { type: Boolean, default: false },
    userId: { type: String },
    createTime: { type: Date, default: Date.now },
    editTime: { type: Date, default: Date.now }
});
