import {  Collect, Tag, Topic, Article, Follow, User } from '../model';

// 更新标签文章数量
export const updateTagArticleCount  = (tagId: string) => {
    const articleQuery: any = { tagId, publish: true };
    const query: any = { _id: tagId };
    return Article.count({ query: articleQuery }).then((resp: any) => {
        return Tag.updateOne({ query, update: { articleCount: resp } })
    });
}

// 更新用户文章数量
export const updateArticleCount  = (userId: string) => {
    const articleQuery: any = { userId, publish: true };
    const query: any = { _id: userId };
    return Article.count({ query: articleQuery }).then((resp: any) => {
        return User.updateOne({ query, update: { articleCount: resp } })
    });
}

// 更新用户专题数量
export const updateTopicCount  = (userId: string) => {
    const articleQuery: any = { userId };
    const query: any = { _id: userId };
    return Topic.count({ query: articleQuery }).then((resp: any) => {
        return User.updateOne({ query, update: { topicCount: resp } })
    });
}

// 更新用户收藏数量
export const updateCollectCount  = (userId: string) => {
    const articleQuery: any = { createUserId: userId };
    const query: any = { _id: userId };
    return Collect.count({ query: articleQuery }).then((resp: any) => {
        return User.updateOne({ query, update: { collectCount: resp } })
    });
}

// 更新用户粉丝数量
export const updateFansCount  = (followUserId: string) => {
    const articleQuery: any = { followUserId, type: 0 };
    const query: any = { _id: followUserId };
    return Follow.count({ query: articleQuery }).then((resp: any) => {
        return User.updateOne({ query, update: { fansCount: resp } })
    });
}

// 更新用户关注数量
export const updateFollowCount  = (userId: string) => {
    const articleQuery: any = { userId };
    const query: any = { _id: userId };
    return Follow.count({ query: articleQuery }).then((resp: any) => {
        return User.updateOne({ query, update: { followCount: resp } })
    });
}