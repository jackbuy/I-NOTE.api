import mongoose from 'mongoose';
import article from './article';
import user from './user';

export const Article = mongoose.model('article', article);
export const User = mongoose.model('user', user);
