import BaseModel from './baseModel';
import { Message, User, Article } from '../schema';

interface messageQuery {
    query: any;
    select: string;
    querySkip: number;
    querylimit: number;
}

class MessageModel extends BaseModel{

    queryLimit({ query, select, querySkip, querylimit }: messageQuery) {
        return Message.find(query, select).
            populate('fromUserId', 'username nickname').
            populate('toUserId', 'username nickname').
            populate('userId', 'username nickname').
            populate('topicId', 'title').
            populate('likeId', 'title').
            populate('collectId', 'title').
            limit(querylimit).
            skip(querySkip).
            sort({_id: -1})
    }

}

export default new MessageModel(Message);