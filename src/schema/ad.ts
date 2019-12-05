import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const tagSchema = new Schema({ // tag
    title: { type: String },
    description: { type: String },
    img: { type: String },
    cateId: { type: ObjectId, ref: 'AdCate' },
    createUserId: { type: ObjectId, ref: 'User' }, // 创建者
    createTime: { type: Date }, // 创建时间
    editUserId: { type: ObjectId, ref: 'User' }, // 编辑者
    editTime: { type: Date }, // 编辑时间
});

export default tagSchema;