import mongoose from 'mongoose'
import { DB_URL } from '../utils/config';

mongoose.connect( DB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})

import article from './article';
import articlePublish from './articlePublish';
import tag from './tag';
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

export const Article = mongoose.model('Article', article);
export const ArticlePublish = mongoose.model('ArticlePublish', articlePublish);
export const Tag = mongoose.model('Tag', tag);
export const User = mongoose.model('User', user);
export const Like = mongoose.model('Like', like);
export const Collect = mongoose.model('Collect', collect);
export const Message = mongoose.model('Message', message);
export const Follow = mongoose.model('Follow', follow);
export const FileManage = mongoose.model('Photo', fileManage);
export const Topic = mongoose.model('Topic', topic);
export const TopicArticle = mongoose.model('TopicArticle', topicArticle);
export const Captcha = mongoose.model('Captcha', captcha);
export const Comment = mongoose.model('Comment', comment);
