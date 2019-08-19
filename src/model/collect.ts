import BaseModel from './baseModel';
import { Collect, User, Article, Tag } from '../schema';

interface query {
    query: any;
    select: string;
    querySkip: number;
    querylimit: number;
}

class CollectModel extends BaseModel {

    collectQueryLimit({ query, select, querySkip, querylimit }: query) {
        return Collect.find(query, select).
            populate({
                path: 'articleId',
                model: Article,
                select: '-__v',
                populate: [
                    { path: 'userId', model: User, select: 'username' },
                    { path: 'tagId', model: Tag, select: 'title' }
                ]
            }).
            limit(querylimit).
            skip(querySkip).
            sort({ _id: -1 })
    }

}

export default new CollectModel(Collect);