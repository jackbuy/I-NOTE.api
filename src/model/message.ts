import BaseModel from './baseModel';
import { Message } from '../schema';

interface query {
    query: any;
    currentPage: string;
    pageSize: string;
    querySort?: any;
}

class MessageModel extends BaseModel{

    constructor(schema: any) {
        super(schema);
    }

    // 列表
    queryListLimit({ query, currentPage = '1', pageSize = '10', querySort = { _id: -1} }: query) {
        const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
        const querylimit: number = parseInt(pageSize);
        const select: string = '-__v';
        const options = {
            skip: querySkip,
            limit: querylimit,
            sort: querySort
        }
        return this.schema.find(query, select, options).
            populate('fromUserId', 'nickname').
            populate('toUserId', 'nickname').
            populate('userId', 'nickname').
            populate('topicId', 'title').
            populate('likeId', 'title').
            populate('collectId', 'title')
    }

}

export default new MessageModel(Message);