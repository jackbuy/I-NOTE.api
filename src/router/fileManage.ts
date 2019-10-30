import FileManage from '../model/fileManage';
import Utils from '../utils/utils';
import { delFile } from './upload';
const { SuccessMsg, ErrorMsg } = Utils;

// 列表
export const fileQuery  = (req: any, res: any) => {
    const { userId, currentPage, pageSize } = req.body;
    const query: any = { createUserId: userId };

    FileManage.queryListLimit({ query, currentPage, pageSize }).then((resp) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 单文件上传并保持到数据库
export const singleFileUpload = async (req: any, res: any) => {
    const { files } = req;
    if (files.length <= 0 || files == null) return ErrorMsg(res, {});

    const { type, targetId } = req.body;
    const { userId } = req.userMsg;
    const { originalname, filename, mimetype, size } = files[0];
    let data: any = {
        originalName: originalname,
        fileName: filename,
        size,
        type,
        mimetype,
        userId,
        createTime: Date.now()
    }
    if (type === '0') data.articleId = targetId;
    if (type === '1') {
        data.topicId = targetId;
        // 删除旧数据
        await fileDel(targetId, '1');
    }
    if (type === '2') {
        data.userAvatarId = userId;
        // 删除旧数据
        await fileDel(userId, '2');
    }

    // 存入数据库
    await FileManage.save({ data });

    SuccessMsg(res, { data: filename });
}

/**
 * 删除数据并删除相应的文件
 * @param targetId 目标id
 * @param type 目标类型 0 文章 1 专题
 * return Promise
 */
export const fileDel = (targetId: string, type: string) => {
    return new Promise(async (resolve, reject) => {
        let query: any;
        if (type === '0') query = { articleId: targetId };
        if (type === '1') query = { topicId: targetId };
        if (type === '2') query = { userAvatarId: targetId };

        try{

            let files: any = await FileManage.find({ query });

            files.map(async (item: any) => {
                const { _id, fileName } = item;
                await FileManage.removeOne({
                    query: {
                        _id
                    }
                });
                await delFile(fileName);
            });

            resolve();

        } catch(err) {

            reject();

        }
    });
}