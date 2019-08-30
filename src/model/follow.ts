import BaseModel from './baseModel';
import { Follow } from '../schema';

interface queryLimit {
    query: any;
    select: string;
    querySkip: number;
    querylimit: number;
}

class FollowModel extends BaseModel {

    // 关注人列表
    followUserQueryLimit({ query, select, querySkip, querylimit }: queryLimit) {
        return Follow.find(query, select).
            populate('followUserId', 'username nickname').
            limit(querylimit).
            skip(querySkip).
            sort({ _id: -1 })
    }

    // 关注专题列表
    followTopicQueryLimit({ query, select, querySkip, querylimit }: queryLimit) {
        return Follow.find(query, select).
            populate('followTopicId', 'title isFollow').
            limit(querylimit).
            skip(querySkip).
            sort({ _id: -1 })
    }

    // 关注标签列表
    followTagQueryLimit({ query, select, querySkip, querylimit }: queryLimit) {
        return Follow.find(query, select).
            populate('followTagId', 'title isFollow').
            limit(querylimit).
            skip(querySkip).
            sort({ _id: -1 })
    }

    // 粉丝列表
    fansQueryLimit({ query, select, querySkip, querylimit }: queryLimit) {
        return Follow.find(query, select).
            populate('userId', 'username nickname').
            limit(querylimit).
            skip(querySkip).
            sort({ _id: -1 })
    }
}

export default new FollowModel(Follow)
