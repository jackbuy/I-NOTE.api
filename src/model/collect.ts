import BaseModel from './baseModel';
import { Collect } from '../schema';

interface query {
    query: any;
    currentPage: string;
    pageSize: string;
    querySort?: any;
}

class CollectModel extends BaseModel {

    // 收藏列表
    queryListLimit({ query, currentPage = '1', pageSize = '10', querySort = { _id: -1} }: query) {
        const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
        const querylimit: number = parseInt(pageSize);
        const select = 'articleId';
        const options = {
            skip: querySkip,
            limit: querylimit,
            sort: querySort
        }
        return Collect.find(query, select, options).
            populate({
                path: 'articleId',
                select: '-__v',
                populate: [
                    { path: 'userId', select: 'username nickname' },
                    { path: 'tagId', select: 'title' }
                ]
            })
    }

}

export default new CollectModel(Collect);