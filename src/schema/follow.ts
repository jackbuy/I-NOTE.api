import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

export default new Schema({ // 关注
    userId: { type: ObjectId, ref: 'User' }, // 我
    followUserId: { type: ObjectId, ref: 'User' }, // 关注人id
    followTopicId: { type: ObjectId, ref: 'Topic' }, // 关注专题id
    followTagId: { type: ObjectId, ref: 'Tag' }, // 关注标签id
    type: { type: Number, default: 0 }, // 类型 0(人) 1(专题) 2(标签)
    createTime: { type: Date, default: Date.now }
});