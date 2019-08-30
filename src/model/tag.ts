import BaseModel from './baseModel';
import { Tag } from '../schema';

interface messageQuery {
    query: any;
    select: string;
    querySkip: number;
    querylimit: number;
}

class TagModel extends BaseModel{

    queryLimit({ query, select, querySkip, querylimit }: messageQuery) {
        return Tag.find(query, select).
            limit(querylimit).
            skip(querySkip).
            sort({ articleCount: -1 })
    }

    tagRecommend({ query, select, querySkip, querylimit }: messageQuery) {
        return Tag.find(query, select).
            limit(querylimit).
            skip(querySkip).
            sort({ articleCount: -1 })
    }

    
    // followPopulateQuery({ type, userId }: followQuery) {
    //     return Follow.find({ type , userId}).
    //         populate({path: 'followId', model: Tag, select: '-__v'})
    // }

}

export default new TagModel(Tag)
