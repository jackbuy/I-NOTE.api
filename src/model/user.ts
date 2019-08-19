import BaseModel from './baseModel';
import { User } from '../schema';

interface messageQuery {
    query: any;
    select: string;
    querySkip: number;
    querylimit: number;
}

class TagModel extends BaseModel{

    userRecommend({ query, select, querySkip, querylimit }: messageQuery) {
        return User.find(query, select).
            limit(querylimit).
            skip(querySkip).
            sort({_id: -1})
    }

}

export default new TagModel(User)