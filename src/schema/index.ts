import mongoose from 'mongoose'
import { DB_URL } from '../utils/config';

mongoose.connect( DB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})

import article from './article';
import tag from './tag';
import user from './user';
import like from './like';
import collect from './collect';
import message from './message';
import follow from './follow';
import photo from './photo';
import topic from './topic';
import captcha from './captcha';

export const Article = mongoose.model('Article', article);
export const Tag = mongoose.model('Tag', tag);
export const User = mongoose.model('User', user);
export const Like = mongoose.model('Like', like);
export const Collect = mongoose.model('Collect', collect);
export const Message = mongoose.model('Message', message);
export const Follow = mongoose.model('Follow', follow);
export const Photo = mongoose.model('Photo', photo);
export const Topic = mongoose.model('Topic', topic);
export const Captcha = mongoose.model('Captcha', captcha);
