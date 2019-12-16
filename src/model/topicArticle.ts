import BaseModel from './baseModel';
import { TopicArticle } from '../schema';

interface query {
    query: any;
    currentPage: string;
    pageSize: string;
    querySort?: any;
}

class TopicModel extends BaseModel{

    constructor(schema: any) {
        super(schema);
    }

    topicArticleQueryLimit({ query, currentPage = '1', pageSize = '10', querySort = { _id: -1} }: query) {
        const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
        const querylimit: number = parseInt(pageSize);
        const select = '-__v';
        const options = {
            skip: querySkip,
            limit: querylimit,
            sort: querySort
        }
        return this.schema.find(query, select, options).
            populate({
                path: 'articleId',
                select: '-__v -contentText',
                populate: [
                    { path: 'userId', select: 'username nickname avatar' },
                    // { path: 'tagId', select: 'title' }
                    {
                        path: 'tagId',
                        select: 'title parentId',
                        populate: [
                            { path: 'parentId', select: 'title' }
                        ]
                    }
                ]
            })
    }
}

export default new TopicModel(TopicArticle)
