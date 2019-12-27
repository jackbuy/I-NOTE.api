import BaseModel from './baseModel';
import { Comment } from '../schema';

interface list {
    query: object;
    currentPage?: string;
    pageSize?: string;
    querySort?: object;
}

class CommentModel extends BaseModel {

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
            populate('commentUserId', 'nickname avatar createTime').
            populate({
                path: 'reply',
                select: '-__v',
                populate: [
                    { path: 'commentUserId', select: 'nickname avatar createTime' },
                    { path: 'replyUserId', select: 'nickname avatar createTime' }
                ]
            })
    }
    // 我的评论列表
    queryUserListLimit({ query, currentPage = '1', pageSize = '10', querySort = { _id: -1} }: list) {
        const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
        const querylimit: number = parseInt(pageSize);
        const select = '-__v';
        const options = {
            skip: querySkip,
            limit: querylimit,
            sort: querySort
        }
        return this.schema.find(query, select, options).
        populate('articleId', 'title')
    }
}

export default new CommentModel(Comment)