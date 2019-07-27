import express from 'express';
const app = express();

import {
    articleQuery, articleDetail, articleSupport, articleAdd, articleEdit, articleDelete
} from '../model/article';
import { tagQuery } from '../model/tag';
import {
    userLogin, userRegister, userInfo, userDeteil
} from '../model/user';

// tag
app.get('/tag/query', tagQuery);

// article
app.post('/article/query', articleQuery);
app.post('/article/detail', articleDetail);
app.get('/article/support/:articleId', articleSupport);
app.post('/article/add', articleAdd);
app.put('/article/edit/:articleId', articleEdit);
app.delete('/article/delete/:articleId', articleDelete);

// user
app.post('/user/login', userLogin);
app.post('/user/register', userRegister);
app.get('/user/userInfo', userInfo);
app.get('/user/userInfo/:userId', userDeteil);

export default app