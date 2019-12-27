import BaseModel from './baseModel';
import { User } from '../schema';

interface list {
    query: object;
    currentPage: string;
    pageSize: string;
    select?: string;
    querySort?: object;
}

class UserModel extends BaseModel{

    constructor(schema: any) {
        super(schema);
    }

    // 列表
    queryListLimit({ query, currentPage = '1', pageSize = '10', select = '-__v', querySort = { _id: -1} }: list) {
        const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
        const querylimit: number = parseInt(pageSize);
        const options = {
            skip: querySkip,
            limit: querylimit,
            sort: querySort
        }
        return this.schema.find(query, select, options)
    }

}

export default new UserModel(User)