
import BaseModel from './baseModel';
import { Article, User, Tag } from '../schema';

class ArticleModel extends BaseModel {

    queryLimit({ query, querySort, querySkip, querylimit }: any) {
        return Article.find(query, { __v: 0 }).
            populate({ path: 'userId', model: User, select: 'username' }).
            populate({ path: 'tagId', model: Tag, select: 'title' }).
            sort(querySort).
            skip(querySkip).
            limit(querylimit)
    }

    findOnePopulate(query: any) {
        return Article.findOne(query).
            populate({ path: 'userId', model: User, select: 'username' });
    }
}

export default new ArticleModel(Article);
