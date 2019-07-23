import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default new Schema({ //用户
    username: { type: String },
    password: { type: String },
    cate: {type: Number, default: 0}, // 0：普通会员
    createTime: { type: Date, default: Date.now },
    editTime: { type: Date, default: Date.now }
});
