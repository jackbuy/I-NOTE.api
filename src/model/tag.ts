import BaseModel from './baseModel';
import { Tag } from '../schema';

interface query {
    query: any;
    currentPage: string;
    pageSize: string;
    querySort?: any;
}

class TagModel extends BaseModel{

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
        return Tag.find(query, select, options).
            populate('createUserId', 'nickname').
            populate('editUserId', 'nickname')
    }

}

export default new TagModel(Tag)
