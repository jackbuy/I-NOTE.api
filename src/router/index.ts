import express from 'express';
const router = express.Router();

import * as Article from './article';
import * as ArticleCate from './articleCate';
import * as ArticlePublish from './articlePublish';
import * as User from './user';
import * as Tag from './tag';
import * as Ad from './ad';
import * as AdCate from './adCate';
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
import * as System from './system';
import * as Link from './link';

// Letter
router.post('/letter/query', Letter.LetterQueryLimit);
router.post('/letter/add', Letter.LetterAdd);

router.post('/letterUser/query', LetterUser.LetterUserQueryLimit);
router.post('/letterUser/add/:toUserId', LetterUser.LetterUserAdd);
router.post('/letterUser/clear/count', LetterUser.clearLetterUserCount);
// router.delete('/tag/delete/:tagId', LetterUser.TagDelete);

// Tag
router.post('/tag/query', Tag.tagQueryLimit);
router.post('/tag/child/query', Tag.tagChildQuery);
router.get('/tag/recommend', Tag.tagRecommend);
router.post('/tag/detail', Tag.tagDetail);
router.post('/tag/add', Tag.tagAdd);
router.post('/tag/edit', Tag.tagEdit);
router.delete('/tag/delete/:tagId', Tag.TagDelete);

// Message
router.post('/message/query', Message.messageQuery);
router.put('/message/read/:messageId', Message.messageRead);
router.delete('/message/delete/:messageId', Message.messageDelete);

// Collect
router.post('/collect/query', Collect.collectQuery);
router.delete('/collect/delete/:collectId/:articleId', Collect.collectDelete);

// Follow
router.post('/follow/user/query', Follow.followUserQuery);
router.post('/follow/topic/query', Follow.followTopicQuery);
router.post('/follow/tag/query', Follow.followTagQuery);
router.post('/fans/query', Follow.fansQuery);
router.post('/follow/user', Follow.followUser);
router.post('/follow/topic', Follow.followTopic);
router.post('/follow/tag', Follow.followTag);

// Article - 已发布
router.post('/article/publish/query', ArticlePublish.articlePublishQuery);
router.post('/article/publish/detail', ArticlePublish.articlePublishDetail);
router.post('/article/publish', ArticlePublish.articlePublish);
router.put('/article/publish/update/:articlePublishId', ArticlePublish.articlePublishUpdate);
router.delete('/article/publish/delete/:articlePublishId/:articleId', ArticlePublish.articlePublishDelete);
router.post('/article/publish/like', ArticlePublish.articlePublishLike);
router.post('/article/publish/collect', ArticlePublish.articlePublishCollect);

// Article - 未发布
router.post('/article/query', Article.articleQuery);
router.get('/article/detail/:articleId', Article.articleDetail);
router.post('/article/add', Article.articleAdd);
router.put('/article/edit/:articleId', Article.articleEdit);
router.delete('/article/delete/:articleId', Article.articleDelete);

// ArticleCate
router.post('/article/cate/query', ArticleCate.articleCateQuery);
router.post('/article/cate/add', ArticleCate.articleCateAdd);
router.put('/article/cate/edit/:articleCateId', ArticleCate.articleCateEdit);
router.delete('/article/cate/delete/:articleCateId', ArticleCate.articleCateDelete);

// User
router.post('/user/login', User.userLogin);
router.post('/user/register', User.userRegister);
router.post('/user/forget', User.userForget);
router.post('/user/userInfo', User.userInfo);
router.post('/user/zoneUserInfo', User.zoneUserInfo);
router.post('/user/userInfoEdit', User.userInfoEdit);
router.post('/user/publish/query', User.userPublishQuery);
router.post('/user/query', User.userQuery);

// operations
router.post('/operations/count', User.operationsCount);

// Topic
router.post('/topic/query', Topic.topicQuery);
router.post('/topic/user/query', Topic.topicUserQuery);
router.post('/topic/user/list', Topic.topicUserList);
router.get('/topic/recommend', Topic.topicRecommend);
router.post('/topic/add', Topic.topicAdd);
router.delete('/topic/delete/:topicId', Topic.topicDelete);
router.put('/topic/edit/:topicId', Topic.topicEdit);
router.post('/topic/detail', Topic.topicDetail);

// TopicArticle
router.post('/topic/article/query', TopicArticle.topicArticleQuery);
router.post('/topic/article/add', TopicArticle.topicArticleAdd);
router.delete('/topic/:topicId/article/delete/:articleId', TopicArticle.topicArticleDelete);

// Email
router.post('/sendRegisterEmail', Email.sendRegisterEmail);
router.post('/sendForgetEmail', Email.sendForgetEmail);

// Comment
router.post('/comment/query', Comment.commentQuery);
router.post('/comment/user/query', Comment.commentUserQuery);
router.post('/comment/save', Comment.commentSave);
router.post('/comment/delete/:commentId', Comment.commentDelete);
router.post('/comment/reply', Comment.commentReply);

// fileManage
router.post('/file/query', FileManage.fileQuery);
router.post('/file/single/upload', Upload.uploadFile.any(), FileManage.singleFileUpload);

// ad
router.post('/ad/cate/query', AdCate.adCateQuery);
router.post('/ad/cate/add', AdCate.adCateAdd);
router.post('/ad/cate/edit', AdCate.adCateEdit);
router.delete('/ad/cate/delete/:cateId', AdCate.adCateDel);
router.post('/ad/query', Ad.adQuery);
router.post('/ad/add', Ad.adAdd);
router.post('/ad/edit', Ad.adEdit);
router.delete('/ad/delete/:adId', Ad.adDel);

// system
router.get('/system/detail', System.systemDetail);

router.post('/system/add', System.systemAdd);
router.post('/system/edit', System.systemEdit);

// link
router.post('/link/query', Link.linkQueryLimit);
router.post('/link/add', Link.linkAdd);
router.post('/link/edit', Link.linkEdit);
router.delete('/link/delete/:linkId', Link.linkDelete);

export default router
