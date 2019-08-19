import Topic from '../model/topic';
import Article from '../model/article';
import { SuccessMsg, ErrorMsg } from '../utils/utils';


// Topic列表
export const topicQuery  = (req: any, res: any) => {
    const query: any = {};
    const select: string = '-__v';
    const querySkip: number = 0;
    const querylimit: number = 15;
    const p1 = Topic.queryLimit({ query, select, querySkip, querylimit });

    p1.then((resp) => { SuccessMsg(res, { data: resp }); })
}


// tag推荐
export const topicRecommend = (req: any, res: any) => {
    const query: any = {};
    const select: string = '-__v';
    const querySkip: number = 0;
    const querylimit: number = 5;
    const p1 = Topic.topicRecommend({ query, select, querySkip, querylimit });

    p1.then((resp) => { SuccessMsg(res, { data: resp }); })
}

// tag新增
export const topicAdd  = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const data: any = {
        ...req.body,
        userId,
        createTime: Date.now()
    };
    Topic.save(data).then((resp: any) => {
        SuccessMsg(res, {});
    });
}

// 专题详情
export const topicDetail = (req: any, res: any) => {
    const { topicId } = req.params;
    const query = { _id: topicId };
    Topic.findOne({ query }).then((resp) => {
        SuccessMsg(res, { data: resp });
    });
}

// 专题相关文章
export const topicArticles = (req: any, res: any) => {
    const { topicId } = req.params;
    const query = { _id: topicId };
    Topic.findOne({ query }).then((resp: any) => {
        let idArr = resp.articleIds.split(',');
        if (idArr.length == 0) Promise.resolve([]);
        let promises = idArr.map((item: any) => {
            const query = { _id: item };
            return Article.findOne({ query })
        })
        return Promise.all(promises);
    }).then((resp: any) => {
        SuccessMsg(res, { data: resp });
    });
}