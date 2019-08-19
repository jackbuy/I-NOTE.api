import BaseModel from './baseModel';
import { Tag } from '../schema';

interface messageQuery {
    query: any;
    select: string;
    querySkip: number;
    querylimit: number;
}

class TagModel extends BaseModel{

    tagRecommend({ query, select, querySkip, querylimit }: messageQuery) {
        return Tag.find(query, select).
            limit(querylimit).
            skip(querySkip).
            sort({_id: -1})
    }

}

export default new TagModel(Tag)
