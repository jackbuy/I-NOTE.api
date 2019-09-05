import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const tagSchema = new Schema({ //tag
    title: { type: String },
    articleCount: { type: Number, default: 0 }, // 文章数量
    isFollow: { type: Boolean, default: false },
    parentId: { type: ObjectId }
});

tagSchema.index({ title: 1, articleCount: 1, isFollow: 1 }, { unique: true });

export default tagSchema;