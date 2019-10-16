import {  Collect, Tag, Topic, ArticlePublish, Follow, User, Comment, TopicArticle } from '../model';

// 更新文章评论数量
export const updateArticleCommentCount = (articleId: string) => {
    const articleQuery: any = { articleId };
    const query: any = { _id: articleId };
    return Comment.count({ query: articleQuery }).then((resp: any) => {
        return ArticlePublish.updateOne({ query, update: { commentCount: resp } })
    });
}

// 更新标签文章数量
export const updateTagArticleCount = async() => {
    const tagList: any = await Tag.find({});

    tagList.map(async (item: any) => {
        const count = await ArticlePublish.count({ query: {tagId: item._id} });
        await Tag.updateOne({ query: { _id: item._id }, update: { articleCount: count } });
    });
}
// export const updateTagArticleCount  = (tagId: string) => {
//     const articleQuery: any = { tagId };
//     const query: any = { _id: tagId };
//     return ArticlePublish.count({ query: articleQuery }).then((resp: any) => {
//         return Tag.updateOne({ query, update: { articleCount: resp } })
//     });
// }

// 更新用户文章数量
export const updateArticleCount = (userId: string) => {
    const articleQuery: any = { userId };
    const query: any = { _id: userId };
    return ArticlePublish.count({ query: articleQuery }).then((resp: any) => {
        return User.updateOne({ query, update: { articleCount: resp } })
    });
}

// 更新用户专题数量
export const updateTopicCount = (userId: string) => {
    const articleQuery: any = { userId };
    const query: any = { _id: userId };
    return Topic.count({ query: articleQuery }).then((resp: any) => {
        return User.updateOne({ query, update: { topicCount: resp } })
    });
}

// 更新用户收藏数量
export const updateCollectCount = (userId: string) => {
    const articleQuery: any = { createUserId: userId };
    const query: any = { _id: userId };
    return Collect.count({ query: articleQuery }).then((resp: any) => {
        return User.updateOne({ query, update: { collectCount: resp } })
    });
}

// 更新用户粉丝数量
export const updateFansCount = (followUserId: string) => {
    const articleQuery: any = { followUserId, type: 0 };
    const query: any = { _id: followUserId };
    return Follow.count({ query: articleQuery }).then((resp: any) => {
        return User.updateOne({ query, update: { fansCount: resp } })
    });
}

// 更新用户关注数量
export const updateFollowCount = (userId: string) => {
    const articleQuery: any = { userId };
    const query: any = { _id: userId };
    return Follow.count({ query: articleQuery }).then((resp: any) => {
        return User.updateOne({ query, update: { followCount: resp } })
    });
}

// 更新专题关注数量
export const updateTopicFollowCount = (topicId: string) => {
    const followQuery: any = { followTopicId: topicId };
    const query: any = { _id: topicId };
    return Follow.count({ query: followQuery }).then((resp: any) => {
        return Topic.updateOne({ query, update: { followCount: resp } })
    });
}

// 更新专题文章数量
export const updateTopicArticleCount = (topicId: string) => {
    const articleQuery: any = { topicId };
    const query: any = { _id: topicId };
    return TopicArticle.count({ query: articleQuery }).then((resp: any) => {
        return Topic.updateOne({ query, update: { articleCount: resp } })
    });
}