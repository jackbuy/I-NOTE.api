
import BaseModel from './baseModel';
import { Article, User, Tag } from '../schema';

class ArticleModel extends BaseModel {

    // 列表
    queryListLimit({ query, querySort, querySkip, querylimit }: any) {
        return Article.find(query, '-__v -contentText -contentHtml').
            populate('userId', 'username nickname').
            populate('tagId', 'title').
            sort(querySort).
            skip(querySkip).
            limit(querylimit)
    }

    // 详情
    queryDetail({ query }: any) {
        return Article.findOne(query).
            populate('tagId', 'title').
            populate('userId', '-password -__v -cate -createTime -editTime');
    }

}

export default new ArticleModel(Article);
