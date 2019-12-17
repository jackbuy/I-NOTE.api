import BaseModel from './baseModel';
import { Topic, Article } from '../schema';

interface list {
    query: object;
    currentPage?: string;
    pageSize?: string;
    querySort?: object;
}

class TopicModel extends BaseModel{

    constructor(schema: any) {
        super(schema);
    }

    // 列表
    queryListLimit({ query, currentPage = '1', pageSize = '10', querySort = { _id: -1} }: list) {
        const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
        const querylimit: number = parseInt(pageSize);
        const select: string = '-__v';
        const options = {
            skip: querySkip,
            limit: querylimit,
            sort: querySort
        }
        return this.schema.find(query, select, options).
            populate('userId', 'nickname avatar')
    }

    queryTopicDetail({ query }: any) {
        const select: string = '-__v';
        return this.schema.findOne(query, select).
            populate('userId', '-password -__v -cate -lastSignAt')
    }

}

export default new TopicModel(Topic)
