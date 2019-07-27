import mongoose from 'mongoose';
import article from './article';
import tag from './tag';
import user from './user';
import support from './support';
import message from './message';

export const Article = mongoose.model('article', article);
export const Tag = mongoose.model('tag', tag);
export const User = mongoose.model('user', user);
export const Support = mongoose.model('support', support);
export const Message = mongoose.model('message', message);
