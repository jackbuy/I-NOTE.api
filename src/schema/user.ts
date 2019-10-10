import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default new Schema({ //用户
    nickname: String, // 昵称
    username: { type: String }, // 账号
    email: { type: String }, // 用户邮箱
    password: { type: String },

    cate: { type: Number, default: 0 }, // 0：普通会员 1000: 超级管理员
    isFollow: { type: Boolean, default: false }, // 是否已关注

    articleCount: { type: Number, default: 0 }, // 文章数量
    topicCount: { type: Number, default: 0 }, // 专题数量
    collectCount: { type: Number, default: 0 }, // 收藏数量
    followCount: { type: Number, default: 0 }, // 关注数量(包括各种类型)
    fansCount: { type: Number, default: 0 }, // 粉丝数量

    createTime: { type: Date, default: Date.now }, // 加入时间
    lastSignAt: { type: Date, default: Date.now }, // 最近登录时间

    avatar: { type: String, default: '' }, // 头像
    gender: { type: Number }, // 性别 0女 1男
    brief: { type: String, default: '' }, // 简介,一句话介绍自己，70个字符限制
    theme: { type: String, default: 'light' }
});
