import { Tag, Follow } from '../model';
import Utils from '../utils/utils';
import { updateTagArticleCount } from './common';
const { SuccessMsg, ErrorMsg } = Utils;

interface setArr {
    arr1: any;
    arr2: any;
    t: string;
    op1: string;
    op2: string;
}

// 过滤数据
const setArr = ({ arr1, arr2, t, op1, op2 }: setArr) => {
    let _arr: any = [];
    arr1.map((item: any) => {
        arr2.map((item2: any) => {
            if (item[op1].equals(item2[op2])) item[t] = true;
        })
        _arr.push(item);
    })
    return _arr;
}


// tag列表
export const tagQueryAll  = async (req: any, res: any) => {
    let userId: string = '';
    const { currentPage, pageSize } = req.body;
    if (req.userMsg) userId = req.userMsg.userId;
    const query: any = {};
    const FollowQuery = { userId, type: 2 };

    let result: any,
        tagList: any,
        followList: any;

    try {

        tagList = await Tag.queryListLimit({ query, currentPage, pageSize });

        if (userId) {
            followList = await Follow.find({ query: FollowQuery });
            result = setArr({ arr1: tagList, arr2: followList, t: 'isFollow', op1: '_id', op2: 'followTagId' });
        }

        SuccessMsg(res, { data: userId ? result : tagList});

    } catch(e) {
        ErrorMsg(res, {});
    }
}

// tag推荐
export const tagRecommend = async (req: any, res: any) => {
    const query: any = {};
    const currentPage: string = '1';
    const pageSize: string = '2';
    const querySort: any = { articleCount: -1 };

    try {

        const result = await Tag.queryListLimit({ query, currentPage, pageSize, querySort });

        SuccessMsg(res, { data: result });

    } catch(e) {
        ErrorMsg(res, {});
    }

}

// tag详情
export const tagDetail = async (req: any, res: any) => {
    const { tagId } = req.body;
    const query = { _id: tagId };
    const select: string = '-__v';
    let userId: string = '';
    if (req.userMsg) userId = req.userMsg.userId;

    try {

        await updateTagArticleCount(tagId);

        let result: any = await Tag.findOne({ query, select });

        if (userId) {
            const follow: any = await Follow.findOne({ query: { userId, followTagId: tagId } })
            if (follow) result.isFollow = true;
        }

        SuccessMsg(res, { data: result });

    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 新增
export const tagAdd = async (req: any, res: any) => {
    const data: any = {
        ...req.body,
        createTime: Date.now()
    };

    try {

        await Tag.save({ data });

        SuccessMsg(res, {});

    } catch(e) {
        ErrorMsg(res, {});
    }

}