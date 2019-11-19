import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const tagSchema = new Schema({ // tag
    title: { type: String },
    articleCount: { type: Number, default: 0 }, // 文章数量
    parentId: { type: ObjectId },
    createUserId: { type: ObjectId, ref: 'User' }, // 创建者
    createTime: { type: Date }, // 创建时间
    editUserId: { type: ObjectId, ref: 'User' }, // 编辑者
    editTime: { type: Date }, // 编辑时间
    children: { type: Array }
});

tagSchema.index({ title: 1, articleCount: 1 }, { unique: true });

export default tagSchema;