
import BaseModel from './baseModel';
import { ArticlePublish } from '../schema';

interface query {
    query: any;
    currentPage: string;
    pageSize: string;
    querySort?: any;
}

class ArticlePublishModel extends BaseModel {

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
            populate('userId', 'username nickname avatar').
            populate({
                path: 'tagId',
                select: 'title parentId',
                populate: [
                    { path: 'parentId', select: 'title' }
                ]
            });
    }

    // 详情
    queryDetail({ query }: any) {
        const select = '-__v';
        return this.schema.findOne(query, select).
            populate('userId', '-password -__v -cate -createTime -editTime').
            populate({
                path: 'tagId',
                select: 'title parentId',
                populate: [
                    { path: 'parentId', select: 'title' }
                ]
            });
    }

}

export default new ArticlePublishModel(ArticlePublish);
