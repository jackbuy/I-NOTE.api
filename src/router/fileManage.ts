import FileManage from '../model/fileManage';
import Utils from '../utils/utils';
import { delFile } from './upload';
import { resolveAny } from 'dns';
const { SuccessMsg, ErrorMsg } = Utils;

interface data {
    originalName: string;
    fileName: string;
    size: number;
    type: number;
    articleId: string;
    mimetype: string;
    userId: string;
}

// 列表
export const photoQuery  = (req: any, res: any) => {
    const { userId, currentPage, pageSize } = req.body;
    const query: any = { createUserId: userId };
    const photoQuery = FileManage.queryListLimit({ query, currentPage, pageSize });

    photoQuery.then((resp) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 文件保存
export const fileSave = (params: data) => {
    const data: any = {
        ...params,
        createTime: Date.now(),
    }
    return FileManage.save({ data })
}

// 文件删除
export const fileDel = (articleId: string) => {
    return new Promise(async (resolve, reject) => {
        const query: any = {
            articleId
        }

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