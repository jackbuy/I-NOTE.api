import express from 'express';
const app = express();

import * as Article from './article';
import * as ArticleCate from './articleCate';
import * as ArticlePublish from './articlePublish';
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
import * as FileManage from './fileManage';
import * as Letter from './letter';
import * as LetterUser from './letterUser';

// Letter
app.post('/letter/query', Letter.LetterQueryLimit);
app.post('/letter/add', Letter.LetterAdd);

app.post('/letterUser/query', LetterUser.LetterUserQueryLimit);
app.post('/letterUser/add/:toUserId', LetterUser.LetterUserAdd);
// app.delete('/tag/delete/:tagId', LetterUser.TagDelete);

// Tag
app.post('/tag/query', Tag.tagQueryLimit);
app.post('/tag/child/query', Tag.tagChildQuery);
app.get('/tag/recommend', Tag.tagRecommend);
app.post('/tag/detail', Tag.tagDetail);
app.post('/tag/add', Tag.tagAdd);
app.post('/tag/edit', Tag.tagEdit);
app.delete('/tag/delete/:tagId', Tag.TagDelete);

// Message
app.post('/message/query', Message.messageQuery);
// app.post('/message/query/new/count', Message.newMessage);
app.put('/message/read/:messageId', Message.messageRead);
app.delete('/message/delete/:messageId', Message.messageDelete);

// Collect
app.post('/collect/query', Collect.collectQuery);
app.delete('/collect/delete/:collectId/:articleId', Collect.collectDelete);

// Follow
app.post('/follow/user/query', Follow.followUserQuery);
app.post('/follow/topic/query', Follow.followTopicQuery);
app.post('/follow/tag/query', Follow.followTagQuery);
app.post('/fans/query', Follow.fansQuery);
app.post('/follow/user', Follow.followUser);
app.post('/follow/topic', Follow.followTopic);
app.post('/follow/tag', Follow.followTag);

// Article - 已发布
app.post('/article/publish/query', ArticlePublish.articlePublishQuery);
app.post('/article/publish/detail', ArticlePublish.articlePublishDetail);
app.post('/article/publish', ArticlePublish.articlePublish);
app.put('/article/publish/update/:articlePublishId', ArticlePublish.articlePublishUpdate);
app.delete('/article/publish/delete/:articlePublishId/:articleId', ArticlePublish.articlePublishDelete);
app.post('/article/publish/like', ArticlePublish.articlePublishLike);
app.post('/article/publish/collect', ArticlePublish.articlePublishCollect);

// Article - 未发布
app.post('/article/query', Article.articleQuery);
app.get('/article/detail/:articleId', Article.articleDetail);
app.post('/article/add', Article.articleAdd);
app.put('/article/edit/:articleId', Article.articleEdit);
app.delete('/article/delete/:articleId', Article.articleDelete);

// ArticleCate
app.post('/article/cate/query', ArticleCate.articleCateQuery);
app.post('/article/cate/add', ArticleCate.articleCateAdd);
app.put('/article/cate/edit/:articleCateId', ArticleCate.articleCateEdit);
app.delete('/article/cate/delete/:articleCateId', ArticleCate.articleCateDelete);

// User
app.post('/user/login', User.userLogin);
app.post('/user/register', User.userRegister);
app.post('/user/forget', User.userForget);
app.post('/user/userInfo', User.userInfo);
app.post('/user/zoneUserInfo', User.zoneUserInfo);
app.post('/user/userInfoEdit', User.userInfoEdit);
app.post('/user/publish/query', User.userPublishQuery);
app.post('/user/query', User.userQuery);

app.post('/operations/count', User.operationsCount);

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
app.delete('/topic/:topicId/article/delete/:articleId', TopicArticle.topicArticleDelete);

// Email
app.post('/sendRegisterEmail', Email.sendRegisterEmail);
app.post('/sendForgetEmail', Email.sendForgetEmail);

// Comment
app.post('/comment/query', Comment.commentQuery);
app.post('/comment/user/query', Comment.commentUserQuery);
app.post('/comment/save', Comment.commentSave);
app.post('/comment/delete/:commentId', Comment.commentDelete);
app.post('/comment/reply', Comment.commentReply);

// fileManage
app.post('/file/query', FileManage.fileQuery);
app.post('/file/single/upload', Upload.uploadFile.any(), FileManage.singleFileUpload);

export default app
