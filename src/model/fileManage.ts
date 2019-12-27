import BaseModel from './baseModel';
import { FileManage } from '../schema';

interface list {
    query: object;
    currentPage?: string;
    pageSize?: string;
    querySort?: object;
}

class FileModel extends BaseModel {

    constructor(schema: any) {
        super(schema);
    }

    // 文件列表
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
            populate('userId', 'nickname avatar').
            populate('articleId', 'title isPublish')
    }

}

export default new FileModel(FileManage);