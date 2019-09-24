import BaseModel from './baseModel';
import { Topic, Article } from '../schema';

interface query {
    query: any;
    currentPage: string;
    pageSize: string;
    querySort?: any;
}

class TopicModel extends BaseModel{

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
        return Topic.find(query, select, options).
            populate('userId', 'nickname avatar')
    }

    queryTopicDetail({ query }: any) {
        const select: string = '-__v';
        return Topic.findOne(query, select).
            populate('userId', '-password -__v -cate -lastSignAt')
    }

}

export default new TopicModel(Topic)
