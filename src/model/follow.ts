import BaseModel from './baseModel';
import { Follow } from '../schema';

interface query {
    query: any;
    currentPage: string;
    pageSize: string;
    querySort?: any;
}

class FollowModel extends BaseModel {

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
        return Follow.find(query, select, options).
            populate('followUserId', 'nickname avatar isFollow').
            populate('followTopicId', 'title img isFollow').
            populate('followTagId', 'title isFollow').
            populate('userId', 'nickname')
    }

}

export default new FollowModel(Follow)
