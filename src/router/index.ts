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
// app.post('/tag/follow/query', Tag.tagFollowQuery);
app.get('/tag/recommend', Tag.tagRecommend);
app.post('/tag/detail', Tag.tagDetail);

// Message
app.post('/message/query', Message.messageQuery);

// Collect
app.post('/collect/query', Collect.collectQuery);

// Follow
app.post('/follow/user/query', Follow.followUserQuery);
app.post('/follow/topic/query', Follow.followTopicQuery);
app.post('/follow/tag/query', Follow.followTagQuery);
app.post('/fans/query', Follow.fansQuery);
app.post('/follow/user', Follow.followUser);
app.post('/follow/topic', Follow.followTopic);
app.post('/follow/tag', Follow.followTag);

// Article
app.post('/article/query', Article.articleQuery);
app.post('/article/detail', Article.articleDetail);
app.get('/article/like/:articleId', Article.articleLike);
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
app.post('/deleteFile', Upload.deleteFile);

// email
app.post('/sendEmail', Email.sendEmail);

export default app
