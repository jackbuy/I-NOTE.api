import express from 'express';
const app = express();

import { articleQuery, articleUserQuery, articleDetail, articleAdd, articleEdit, articleDelete } from '../model/article';
import { tagQuery } from '../model/tag';
import { userLogin, userRegister, CheckUserIsLogin, userLoginDeteil, userDeteil } from '../model/user';

// tag
app.get('/tag/query', tagQuery);

// article
app.post('/article/query', articleQuery);
app.post('/article/loginUser/query', articleUserQuery);
app.post('/article/detail', articleDetail);
app.post('/article/add', articleAdd);
app.put('/article/edit/:articleId', articleEdit);
app.delete('/article/delete/:articleId', articleDelete);

// user
app.post('/user/login', userLogin);
app.post('/user/register', userRegister);
app.get('/user/isLogin', CheckUserIsLogin);
app.get('/user/loginUserInfo', userLoginDeteil);
app.get('/user/userInfo/:userId', userDeteil);

export default app