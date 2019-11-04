import BaseModel from './baseModel';
import { Comment } from '../schema';
import mongoose from 'mongoose';

interface query {
    query: any;
    currentPage?: string;
    pageSize?: string;
    querySort?: any;
}

class Model extends BaseModel {

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
        return Comment.find(query, select, options).
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
    queryUserListLimit({ query, currentPage = '1', pageSize = '10', querySort = { _id: -1} }: query) {
        const querySkip: number = (parseInt(currentPage)-1) * parseInt(pageSize);
        const querylimit: number = parseInt(pageSize);
        const select = '-__v';
        const options = {
            skip: querySkip,
            limit: querylimit,
            sort: querySort
        }
        return Comment.find(query, select, options).
        populate('articleId', 'title')
    }
}

export default new Model(Comment)