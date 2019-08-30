import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

export default new Schema({ //tag
    title: { type: String },
    articleCount: { type: Number, default: 0 }, // 文章数量
    isFollow: { type: Boolean, default: false },
    parentId: { type: ObjectId }
});
