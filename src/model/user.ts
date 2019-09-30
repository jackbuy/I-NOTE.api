import BaseModel from './baseModel';
import { User } from '../schema';

interface query {
    query: any;
    currentPage: string;
    pageSize: string;
    select?: string;
    querySort?: any;
}

class TagModel extends BaseModel{

    // 列表
    queryListLimit({ query, currentPage = '1', pageSize = '10', select = '-__v', querySort = { _id: -1} }: query) {
        const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
        const querylimit: number = parseInt(pageSize);
        const options = {
            skip: querySkip,
            limit: querylimit,
            sort: querySort
        }
        return User.find(query, select, options)
    }

}

export default new TagModel(User)