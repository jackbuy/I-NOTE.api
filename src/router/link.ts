import { Link } from '../model';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

// 列表- 分页查询
export const linkQueryLimit = async (req: any, res: any) => {

    let query: any = {}

    try {
        const userList = await Link.queryListLimit({ query });
        SuccessMsg(res, { data: userList });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 新增
export const linkAdd = async (req: any, res: any) => {
    const { userId } = req.userMsg;

    let data: any = {
        ...req.body,
        createUserId: userId,
        createTime: Date.now()
    };
    try {
        await Link.save({ data });
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
}


// 编辑
export const linkEdit = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { linkId } = req.body;

    let query: any = {
        _id: linkId
    }
    let update: any = {
        ...req.body,
        editUserId: userId,
        editTime: Date.now()
    };
    try {
        await Link.updateOne({ query, update });
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 删除
export const linkDelete = async (req: any, res: any) => {
    const { linkId } = req.params;

    let query: any = {
        _id: linkId
    }
    try {
        await Link.removeOne({ query });
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
}