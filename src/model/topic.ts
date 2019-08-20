import BaseModel from './baseModel';
import { Topic, User } from '../schema';

interface messageQuery {
    query: any;
    select: string;
    querySkip: number;
    querylimit: number;
}

class TopicModel extends BaseModel{

    queryLimit({ query, select, querySkip, querylimit }: messageQuery) {
        return Topic.find(query, select).
            populate({path: 'userId', model: User, select: 'username'}).
            limit(querylimit).
            skip(querySkip).
            sort({_id: -1})
    }

    // 推荐
    topicRecommend({ query, select, querySkip, querylimit }: messageQuery) {
        return Topic.find(query, select).
            limit(querylimit).
            skip(querySkip).
            sort({_id: -1})
    }

}

export default new TopicModel(Topic)
