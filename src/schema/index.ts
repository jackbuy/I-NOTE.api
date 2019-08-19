import mongoose from 'mongoose';

import article from './article';
import tag from './tag';
import user from './user';
import support from './support';
import collect from './collect';
import message from './message';
import follow from './follow';
import photo from './photo';
import topic from './topic';

export const Article = mongoose.model('article', article);
export const Tag = mongoose.model('tag', tag);
export const User = mongoose.model('user', user);
export const Support = mongoose.model('support', support);
export const Collect = mongoose.model('collect', collect);
export const Message = mongoose.model('message', message);
export const Follow = mongoose.model('follow', follow);
export const Photo = mongoose.model('photo', photo);
export const Topic = mongoose.model('topic', topic);
