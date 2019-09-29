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
import * as TopicArticle from './topicArticle';
import * as Email from './email';
import * as Comment from './comment';

// Tag
app.post('/tag/query', Tag.tagQueryAll);
app.get('/tag/recommend', Tag.tagRecommend);
app.post('/tag/detail', Tag.tagDetail);
app.post('/tag/add', Tag.tagAdd);
app.post('/tag/edit', Tag.tagEdit);
app.delete('/tag/delete/:tagId', Tag.TagDelete);

// Message
app.post('/message/query', Message.messageQuery);
app.post('/message/query/new/count', Message.newMessage);
app.put('/message/read/:messageId', Message.messageRead);
app.delete('/message/delete/:messageId', Message.messageDelete);

// Collect
app.post('/collect/query', Collect.collectQuery);
app.delete('/collect/delete/:collectId', Collect.collectDelete);

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
app.post('/article/like', Article.articleLike);
app.post('/article/collect', Article.articleCollect);
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

// Topic
app.post('/topic/query', Topic.topicQuery);
app.post('/topic/user/query', Topic.topicUserQuery);
app.post('/topic/user/list', Topic.topicUserList);
app.get('/topic/recommend', Topic.topicRecommend);
app.post('/topic/add', Topic.topicAdd);
app.delete('/topic/delete/:topicId', Topic.topicDelete);
app.put('/topic/edit/:topicId', Topic.topicEdit);
app.post('/topic/detail', Topic.topicDetail);

// TopicArticle
app.post('/topic/article/query', TopicArticle.topicArticleQuery);
app.post('/topic/article/add', TopicArticle.topicArticleAdd);
app.delete('/topic/article/delete/:topicArticleId', TopicArticle.topicArticleDelete);

// upload
app.post('/uploadfile', Upload.upload.any(), Upload.uploadFile);
app.post('/single/uploadfile', Upload.upload.any(), Upload.singleFileUpload);
app.post('/deleteFile', Upload.deleteFile);

// Email
app.post('/sendEmail', Email.sendEmail);

// Comment
app.post('/comment/query', Comment.commentQuery);
app.post('/comment/save', Comment.commentSave);
app.post('/comment/delete/:commentId', Comment.commentDelete);
app.post('/comment/reply', Comment.commentReply);

export default app
