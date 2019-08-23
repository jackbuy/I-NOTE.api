import BaseModel from './baseModel';
import { Topic, User, Article } from '../schema';

interface messageQuery {
    query: any;
    select: string;
    querySkip: number;
    querylimit: number;
}
interface topicArticle {
    query: any;
    select: string;
}

class TopicModel extends BaseModel{

    queryLimit({ query, select, querySkip, querylimit }: messageQuery) {
        return Topic.find(query, select).
            populate({path: 'userId', model: User, select: 'username nickname'}).
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

    queryTopicArticle({ query, select }: topicArticle) {
        return Article.findOne(query, select).
            populate({path: 'userId', model: User, select: 'username nickname'})
    }

}

export default new TopicModel(Topic)
