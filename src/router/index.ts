import express from 'express';
const app = express();

import * as Article from '../model/article';
import * as User from '../model/user';
import * as Tag from '../model/tag';
import * as Message from '../model/message';
import * as Upload from '../model/upload';

// Tag
app.get('/tag/query', Tag.tagQuery);

// Message
app.get('/message/query', Message.messageQuery);

// Article
app.post('/article/query', Article.articleQuery);
app.post('/article/detail', Article.articleDetail);
app.get('/article/support/:articleId', Article.articleSupport);
app.post('/article/add', Article.articleAdd);
app.put('/article/edit/:articleId', Article.articleEdit);
app.delete('/article/delete/:articleId', Article.articleDelete);

// User
app.post('/user/login', User.userLogin);
app.post('/user/register', User.userRegister);
app.get('/user/userInfo', User.userInfo);
app.get('/user/userInfo/:userId', User.userDeteil);

// upload
app.post('/uploadfile', Upload.upload.any(), Upload.uploadFunc);

export default app
