import { Tag, Follow, ArticlePublish } from '../model';
import Utils from '../utils/utils';
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
            item._doc[t] = item[op1].equals(item2[op2]) ? true : false;
        })
        _arr.push(item);
    })
    return _arr;
}

const fn = (data: any, pid: any) => {
    let result = [];
    let temp;
    for (var i in data) {
        // if (data[i]['parentId'] == pid) {
        if (data[i]['parentId'] && data[i]['parentId'].toString() == pid.toString()) {
            result.push(data[i]);
            temp = fn(data, data[i]._id);
            if (temp.length > 0) {
                data[i].children = temp;
            }
        }
    }
    return result;
}

const toTreeJson = (data: any) => {
    let result = [];
    let temp;
    for (const i in data) {
        if (!data[i].parentId) {
            result.push(data[i]);
            temp = fn(data, data[i]._id);
            if (temp.length > 0) {
                data[i].children = temp;
            }
        }
    }
    return result;
}


// tag列表- 分页查询
export const tagQueryLimit = async (req: any, res: any) => {
    let userId: string = '';
    if (req.userMsg) userId = req.userMsg.userId;
    const query: any = {};
    const FollowQuery = { userId, type: 2 };

    let result: any,
        tagList: any,
        followList: any,
        data: any;

    try {

        tagList = await Tag.queryList({ query });

        if (userId) {
            followList = await Follow.find({ query: FollowQuery });
            result = setArr({ arr1: tagList, arr2: followList, t: 'isFollow', op1: '_id', op2: 'followTagId' });
        }

        data = userId ? result : tagList;

        SuccessMsg(res, { data: toTreeJson(data)});

    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 子级查询
export const tagChildQuery = async (req: any, res: any) => {
    const query: any = {
        parentId: { $exists: true } // 存在parentId的数据
    };

    let tagChildList: any = [];

    try {

        tagChildList = await Tag.find({ query })

        SuccessMsg(res, { data: tagChildList});

    } catch(e) {
        ErrorMsg(res, {});
    }
}

// tag推荐
export const tagRecommend = async (req: any, res: any) => {
    const query: any = {
        parentId: { $exists: true }
    };
    const currentPage: string = '1';
    const pageSize: string = '14';
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

        let result: any = await Tag.findOne({ query, select });

        if (userId) {
            const follow: any = await Follow.findOne({ query: { userId, followTagId: tagId } })
            result._doc.isFollow = follow ? true : false;
        }

        SuccessMsg(res, { data: result });

    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 新增
export const tagAdd = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { title, parentId } = req.body;
    const data: any = {
        title,
        parentId,
        createUserId: userId,
        createTime: Date.now()
    };

    try {

        await Tag.save({ data });

        SuccessMsg(res, {});

    } catch(e) {
        ErrorMsg(res, {});
    }

}

// 编辑
export const tagEdit = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { tagId, title } = req.body;
    const query = {
        _id: tagId
    };
    const update: any = {
        title,
        editUserId: userId,
        editTime: Date.now()
    };

    try {

        await Tag.updateOne({ query, update })

        SuccessMsg(res, {});

    } catch(e) {
        ErrorMsg(res, {});
    }

}

// 删除
export const TagDelete = async (req: any, res: any) => {
    const { tagId } = req.params;
    const query = { _id: tagId };

    try {

        const count: any = await ArticlePublish.count({ query: { tagId } });
        if (count > 0) return ErrorMsg(res, { msg: '标签已关联文章，不能删除！' });

        await Tag.removeOne({ query })

        SuccessMsg(res, {});

    } catch(e) {
        ErrorMsg(res, {});
    }

}