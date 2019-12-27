import mongoose from 'mongoose'
import { DB_URL } from '../utils/config';

mongoose.connect( DB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})

// 连接成功
mongoose.connection.on('connected', function () {
    console.log('MongoDB连接成功...');  
});

// 连接异常
mongoose.connection.on('error',function (err) {
    console.log('MongoDB连接失败: ' + err);
});

// 连接断开
mongoose.connection.on('disconnected', function () {
    console.log('MongoDB连接断开。');
});

import article from './article';
import articleCate from './articleCate';
import articlePublish from './articlePublish';
import tag from './tag';
import adCate from './adCate';
import ad from './ad';
import user from './user';
import like from './like';
import collect from './collect';
import message from './message';
import follow from './follow';
import fileManage from './fileManage';
import topic from './topic';
import topicArticle from './topicArticle';
import captcha from './captcha';
import comment from './comment';
import letter from './letter';
import letterUser from './letterUser';
import system from './system';

export const Article = mongoose.model('Article', article);
export const ArticleCate = mongoose.model('ArticleCate', articleCate);
export const ArticlePublish = mongoose.model('ArticlePublish', articlePublish);
export const Tag = mongoose.model('Tag', tag);
export const AdCate = mongoose.model('AdCate', adCate);
export const Ad = mongoose.model('Ad', ad);
export const User = mongoose.model('User', user);
export const Like = mongoose.model('Like', like);
export const Collect = mongoose.model('Collect', collect);
export const Message = mongoose.model('Message', message);
export const Follow = mongoose.model('Follow', follow);
export const FileManage = mongoose.model('FileManage', fileManage);
export const Topic = mongoose.model('Topic', topic);
export const TopicArticle = mongoose.model('TopicArticle', topicArticle);
export const Captcha = mongoose.model('Captcha', captcha);
export const Comment = mongoose.model('Comment', comment);
export const Letter = mongoose.model('Letter', letter);
export const LetterUser = mongoose.model('LetterUser', letterUser);
export const System = mongoose.model('System', system);
