import BaseModel from './baseModel';
import { Ad } from '../schema';

interface list {
    query: object;
    currentPage?: string;
    pageSize?: string;
    querySort?: object;
}

class AdModel extends BaseModel{

    constructor(schema: any) {
        super(schema);
    }

    // 列表
    queryListLimit({ query, currentPage = '1', pageSize = '10', querySort = { _id: -1} }: list) {
        const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
        const querylimit: number = parseInt(pageSize);
        const select = '-__v';
        const options = {
            skip: querySkip,
            limit: querylimit,
            sort: querySort
        }
        return this.schema.find(query, select, options).
            populate('createUserId', 'username nickname avatar').
            populate('editUserId', 'username nickname avatar')
    }

}

export default new AdModel(Ad)
