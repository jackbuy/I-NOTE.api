import { Ad } from '../model';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;


// 列表- 分页查询
export const adQuery = async (req: any, res: any) => {
    const { cateId, currentPage, pageSize } = req.body;
    const query: any = {
        cateId
    };

    try {
        const adList = await Ad.queryListLimit({ query, currentPage, pageSize });
        SuccessMsg(res, { data: adList});
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 新增
export const adAdd = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { cateId, title, description, img } = req.body;
    const data: any = {
        cateId,
        title,
        description,
        img,
        createUserId: userId,
        createTime: Date.now()
    };

    try {
        await Ad.save({ data });
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 编辑
export const adEdit = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { adId, cateId, title, description, img } = req.body;
    const query: any = {
        _id: adId
    };
    const update: any = {
        cateId,
        title,
        description,
        img,
        editUserId: userId,
        editTime: Date.now()
    };

    try {
        await Ad.updateOne({ query, update })
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 删除
export const adDel = async (req: any, res: any) => {
    const { adId } = req.params;
    const query: any = { _id: adId };

    try {
        await Ad.removeOne({ query })
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
}