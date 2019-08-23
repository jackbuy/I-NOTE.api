import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default new Schema({ //tag
    title: { type: String },
    isFollow: { type: Boolean, default: false },
    articleCount: { type: Number, default: 0 } // 文章数量
});
