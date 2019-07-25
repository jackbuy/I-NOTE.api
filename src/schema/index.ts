import mongoose from 'mongoose';
import article from './article';
import tag from './tag';
import user from './user';

export const Article = mongoose.model('article', article);
export const Tag = mongoose.model('tag', tag);
export const User = mongoose.model('user', user);
