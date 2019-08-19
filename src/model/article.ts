
import BaseModel from './baseModel';
import { Article, User, Tag } from '../schema';

class ArticleModel extends BaseModel {

    queryLimit({ query, querySort, querySkip, querylimit, publish }: any) {
        if (publish === 'true') {
            return Article.find(query, '-__v -contentText -contentHtml').
                populate({ path: 'userId', model: User, select: 'username' }).
                populate({ path: 'tagId', model: Tag, select: 'title' }).
                sort(querySort).
                skip(querySkip).
                limit(querylimit)
        } else {
            return Article.find(query, '-__v -contentText -contentHtml').
                populate({ path: 'userId', model: User, select: 'username' }).
                sort(querySort).
                skip(querySkip).
                limit(querylimit)
        }
    }

    findOnePopulate({ query, isEdit }: any) {
        if (isEdit === 'true' ) {
            return Article.findOne(query).
                populate({ path: 'userId', model: User, select: 'username' });
        } else {
            return Article.findOne(query).
                populate({ path: 'tagId', model: Tag, select: 'title' }).
                populate({ path: 'userId', model: User, select: 'username' });
        }
    }
}

export default new ArticleModel(Article);
