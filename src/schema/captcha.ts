
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default new Schema({ // 验证码
  email: { type: String, lowercase: true, trim: true },
  captcha: { type: String, required: true }, // 验证码
  type: { type: Number, required: true, default: 0 }, // 验证码类型 0 新用户注册 1 重置密码
  create_at: { type: Date, expires: 60*15, default: Date.now } // 15分钟后自动删除
});
