import BaseModel from './baseModel';
import { Message, User, Article } from '../schema';

interface messageQuery {
    query: any;
    querySkip: number;
    querylimit: number;
}

class MessageModel extends BaseModel{

    queryLimit({ query, querySkip, querylimit }: messageQuery) {
        return Message.find(query, '-__v').
            populate({ path: 'createUserId', model: User, select: 'username' }).
            populate({ path: 'receiveUserId', model: User, select: 'username' }).
            populate({ path: 'articleId', model: Article, select: 'title' }).
            limit(querylimit).
            skip(querySkip).
            sort({_id: -1})
    }

}

export default new MessageModel(Message);