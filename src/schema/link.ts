import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const linkSchema = new Schema({ // tag
    title: { type: String },
    url: { type: String },
    description: { type: String },
    createUserId: { type: ObjectId, ref: 'User' }, // 创建者
    createTime: { type: Date }, // 创建时间
    editUserId: { type: ObjectId, ref: 'User' }, // 编辑者
    editTime: { type: Date }, // 编辑时间
});

export default linkSchema;