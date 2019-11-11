import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const articleSchema = new Schema({ //文章分类
    title: { type: String },
    userId: { type: ObjectId, ref: 'User' },
    createTime: { type: Date, default: Date.now },
    editTime: { type: Date, default: Date.now }
});

export default articleSchema;