import { AdCate } from '../model';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;


// 分类列表- 分页查询
export const adCateQuery = async (req: any, res: any) => {
    const query: any = {};

    try {

        const adCateList = await AdCate.find({ query });

        SuccessMsg(res, { data: adCateList});

    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 新增
export const adCateAdd = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { title, description } = req.body;
    const data: any = {
        title,
        description,
        createUserId: userId,
        createTime: Date.now()
    };

    try {

        await AdCate.save({ data });

        SuccessMsg(res, {});

    } catch(e) {
        ErrorMsg(res, {});
    }

}

// 编辑
export const adCateEdit = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const { cateId, title, description } = req.body;
    const query: any = {
        _id: cateId
    };
    const update: any = {
        title,
        description,
        editUserId: userId,
        editTime: Date.now()
    };

    try {

        await AdCate.updateOne({ query, update })

        SuccessMsg(res, {});

    } catch(e) {
        ErrorMsg(res, {});
    }

}

// 删除
export const adCateDel = async (req: any, res: any) => {
    const { cateId } = req.params;
    const query: any = { _id: cateId };

    try {

        // const count: any = await ArticlePublish.count({ query: { tagId } });
        // if (count > 0) return ErrorMsg(res, { msg: '标签已关联文章，不能删除！' });

        await AdCate.removeOne({ query })

        SuccessMsg(res, {});

    } catch(e) {
        ErrorMsg(res, {});
    }

}