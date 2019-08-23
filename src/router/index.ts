import express from 'express';
const app = express();

import * as Article from './article';
import * as User from './user';
import * as Tag from './tag';
import * as Collect from './collect';
import * as Message from './message';
import * as Upload from './upload';
import * as Follow from './follow';
import * as Topic from './topic';
import * as Email from './email';

// Tag
app.post('/tag/query', Tag.tagQueryAll);
app.post('/tag/follow/query', Tag.tagFollowQuery);
app.get('/tag/recommend', Tag.tagRecommend);

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
app.post('/user/zoneUserInfo', User.zoneUserInfo);
app.post('/user/userInfoEdit', User.userInfoEdit);
app.get('/user/recommend', User.userRecommend);

// topic
app.post('/topic/query', Topic.topicQuery);
app.post('/topic/user/query', Topic.topicUserQuery);
app.get('/topic/recommend', Topic.topicRecommend);
app.post('/topic/add', Topic.topicAdd);
app.delete('/topic/delete/:topicId', Topic.topicDelete);
app.put('/topic/edit/:topicId', Topic.topicEdit);
app.post('/topic/detail', Topic.topicDetail);
app.post('/topic/article/query', Topic.topicArticlesQuery);

// upload
app.post('/uploadfile', Upload.upload.any(), Upload.uploadFunc);

// email
app.post('/sendEmail', Email.sendEmail);

export default app
