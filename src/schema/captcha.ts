
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default new Schema({ // 验证码
  email: { type: String, lowercase: true, trim: true },
  captcha: { type: String, required: true }, // 验证码
  create_at: { type: Date, expires: 60*15, default: Date.now } // 15分钟后自动删除
});
