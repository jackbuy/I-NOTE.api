import express from 'express';
const app = express();


import { articleQuery, articleDetail, articleAdd } from '../model/article';
import { userLogin, userRegister, CheckUserIsLogin, userQuery, userEdit, userDelete } from '../model/user';

app.get('/article/query', articleQuery);
app.post('/article/detail', articleDetail);
// app.get('/article/detail', articleDetail);
app.post('/article/add', articleAdd);

app.post('/user/login', userLogin);
app.post('/user/register', userRegister);
app.get('/user/isLogin', CheckUserIsLogin);

// app.get('/user/query', userQuery);
// app.put('/user', userEdit);
// app.delete('/user', userDelete);

export default app