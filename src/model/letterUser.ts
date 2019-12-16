import BaseModel from './baseModel';
import { LetterUser } from '../schema';
interface query {
    query: any;
    currentPage?: string;
    pageSize?: string;
    querySort?: any;
}

class Model extends BaseModel {

    constructor(schema: any) {
        super(schema);
    }

    // 列表
    queryListLimit({ query, currentPage = '1', pageSize = '10', querySort = { _id: -1} }: query) {
        const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
        const querylimit: number = parseInt(pageSize);
        const select = '-__v';
        const options = {
            skip: querySkip,
            limit: querylimit,
            sort: querySort
        }
        return this.schema.find(query, select, options).
            populate('letterId', 'content createTime').
            populate('fromUserId', 'nickname').
            populate('toUserId', 'nickname')
    }

}

export default new Model(LetterUser)