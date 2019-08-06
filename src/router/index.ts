import express from 'express';
const app = express();

import * as Article from '../model/article';
import * as User from '../model/user';
import * as Tag from '../model/tag';
import * as Message from '../model/message';
import * as Upload from '../model/upload';
import * as Collect from '../model/collect';
import * as Follow from '../model/follow';

// Tag
app.post('/tag/query', Tag.tagQuery);
app.post('/tag/follow/query', Tag.tagFollowQuery);

// Message
app.get('/message/query', Message.messageQuery);

// Collect
app.post('/collect/query', Collect.collectQuery);

// Follow
app.post('/follow/query', Follow.followQuery);
app.post('/fans/query', Follow.fansQuery);
app.post('/follow', Follow.follow);

// Article
app.post('/article/query', Article.articleQuery);
app.post('/article/detail', Article.articleDetail);
app.get('/article/support/:articleId', Article.articleSupport);
app.get('/article/collect/:articleId', Article.articleCollect);
app.post('/article/add', Article.articleAdd);
app.put('/article/edit/:articleId', Article.articleEdit);
app.delete('/article/delete/:articleId', Article.articleDelete);

// User
app.post('/user/login', User.userLogin);
app.post('/user/register', User.userRegister);
app.post('/user/userInfo', User.userInfo);

// upload
app.post('/uploadfile', Upload.upload.any(), Upload.uploadFunc);

export default app
