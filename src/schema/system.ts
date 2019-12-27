import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default new Schema({ // 系统配置
    name: String, // 系统名称
    description: { type: String }, // 系统描述
    key: { type: String }, // 系统关键字
    logo: { type: String }, // 系统图标
    ico: { type: String }, // 系统ico
});
