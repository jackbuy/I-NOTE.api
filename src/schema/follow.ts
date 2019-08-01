import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default new Schema({ // 关注
    userId: { type: String }, // 我
    followId: { type: String }, // 关注的人或专题Id
    type: { type: Number, default: 0 }, // 关注类型 0（关注人）、1（关注专题）
    createTime: { type: Date, default: Date.now }
});