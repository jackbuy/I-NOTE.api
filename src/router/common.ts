import { Collect, Tag, Topic, ArticlePublish, Follow, User, Comment, TopicArticle, Message } from '../model';

// 更新文章评论数量
export const updateArticleCommentCount = async (articleId: string) => {
    const articleQuery: any = { articleId };
    const query: any = { _id: articleId };
    const commentCount: any = await Comment.count({ query: articleQuery });
    return ArticlePublish.updateOne({ query, update: { commentCount } })
}

// 更新标签文章数量
export const updateTagArticleCount = async () => {
    const tagList: any = await Tag.find({});

    for await (const item of tagList) {
        const articleCount: any = await ArticlePublish.count({ query: {tagId: item._id} });
        await Tag.updateOne({ query: { _id: item._id }, update: { articleCount } });
    }
}

// 更新用户文章数量
export const updateArticleCount = async (userId: string) => {
    const articleQuery: any = { userId };
    const query: any = { _id: userId };
    const articleCount: any = await ArticlePublish.count({ query: articleQuery });
    return User.updateOne({ query, update: { articleCount } })
}

// 更新用户专题数量
export const updateTopicCount = async (userId: string) => {
    const articleQuery: any = { userId };
    const query: any = { _id: userId };
    const topicCount: any = await Topic.count({ query: articleQuery });
    return User.updateOne({ query, update: { topicCount } })
}

// 更新用户收藏数量
export const updateCollectCount = async (userId: string) => {
    const articleQuery: any = { createUserId: userId };
    const query: any = { _id: userId };
    const collectCount: any = await Collect.count({ query: articleQuery });
    return User.updateOne({ query, update: { collectCount } })
}

// 更新用户粉丝数量
export const updateFansCount = async (followUserId: string) => {
    const articleQuery: any = { followUserId, type: 0 };
    const query: any = { _id: followUserId };
    const fansCount: any = await Follow.count({ query: articleQuery });
    return User.updateOne({ query, update: { fansCount } })
}

// 更新用户关注数量
export const updateFollowCount = async (userId: string) => {
    const articleQuery: any = { userId };
    const query: any = { _id: userId };
    const followCount: any = await Follow.count({ query: articleQuery });
    return User.updateOne({ query, update: { followCount } })
}

// 更新专题关注数量
export const updateTopicFollowCount = async (topicId: string) => {
    const followQuery: any = { followTopicId: topicId };
    const query: any = { _id: topicId };
    const followCount: any = await Follow.count({ query: followQuery });
    return Topic.updateOne({ query, update: { followCount } })
}

// 更新专题文章数量
export const updateTopicArticleCount = async (topicId: string) => {
    const articleQuery: any = { topicId };
    const query: any = { _id: topicId };
    const articleCount: any = await TopicArticle.count({ query: articleQuery });
    return Topic.updateOne({ query, update: { articleCount } })
}

// 获取未读消息数量
export const getNewMessageCount = (toUserId: string) => {
    const query: any = { toUserId, isRead: false };
    return Message.count({ query });
}

// 已发布文章数量
export const articlePublishCount = () => {
    return ArticlePublish.count({ query: {} });
}

// 专题数量
export const topicCount = () => {
    return Topic.count({ query: {} });
}

// 会员数量
export const userCount = () => {
    return User.count({ query: {} });
}