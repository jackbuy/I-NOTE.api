
import BaseModel from './baseModel';
import { Article, User, Tag } from '../schema';

class ArticleModel extends BaseModel {

    queryLimit({ query, querySort, querySkip, querylimit, publish }: any) {
        if (publish === 'true') {
            return Article.find(query, '-__v -contentText -contentHtml').
                populate({ path: 'userId', model: User, select: 'username nickname' }).
                populate({ path: 'tagId', model: Tag, select: 'title' }).
                sort(querySort).
                skip(querySkip).
                limit(querylimit)
        } else {
            return Article.find(query, '-__v -contentText -contentHtml').
                populate({ path: 'userId', model: User, select: 'username nickname' }).
                sort(querySort).
                skip(querySkip).
                limit(querylimit)
        }
    }

    findOnePopulate({ query, isEdit }: any) {
        if (isEdit === 'true' ) {
            return Article.findOne(query).
                populate({ path: 'userId', model: User, select: '-password -__v -cate -createTime -editTime' });
        } else {
            return Article.findOne(query).
                populate({ path: 'tagId', model: Tag, select: 'title' }).
                populate({ path: 'userId', model: User, select: '-password -__v -cate -createTime -editTime' });
        }
    }

}

export default new ArticleModel(Article);
