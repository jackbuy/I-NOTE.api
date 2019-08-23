import BaseModel from './baseModel';
import { Follow, User, Tag } from '../schema';

interface queryLimit {
    query: any;
    select: string;
    querySkip: number;
    querylimit: number;
}

interface followQuery {
    type: number;
    userId: string;
}

class FollowModel extends BaseModel {

    // 关注列表
    followQueryLimit({ query, select, querySkip, querylimit }: queryLimit) {
        return Follow.find(query, select).
            populate({path: 'followId', model: User, select: 'username nickname'}).
            limit(querylimit).
            skip(querySkip).
            sort({ _id: -1 })
    }

    // 粉丝列表
    fansQueryLimit({ query, select, querySkip, querylimit }: queryLimit) {
        return Follow.find(query, select).
            populate({ path: 'userId', model: User, select: 'username nickname' }).
            limit(querylimit).
            skip(querySkip).
            sort({ _id: -1 })
    }

    followPopulateQuery({ type, userId }: followQuery) {
        return Follow.find({ type , userId}).
            populate({path: 'followId', model: Tag, select: '-__v'})
    }
}

export default new FollowModel(Follow)
