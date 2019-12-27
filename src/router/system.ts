import { System } from '../model';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;


// 详情
export const systemDetail = async (req: any, res: any) => {
    try {
        const result: any = await System.findOne({});
        SuccessMsg(res, { data: result});
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 新增
export const systemAdd = async (req: any, res: any) => {
    const data: any = {
        ...req.body
    };

    try {
        await System.save({ data });
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 编辑
export const systemEdit = async (req: any, res: any) => {
    const { _id } = req.body;
    const query: any = {
        _id
    };
    const update: any = {
        ...req.body
    };

    try {
        await System.updateOne({ query, update });
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
}
