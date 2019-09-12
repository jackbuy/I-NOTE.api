import FileManage from '../model/fileManage';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

interface data {
    name: string;
    filename: string;
    size: number;
    type: number;
    mimetype: string;
    userId: string;
}

// 文件保存
export const fileSave = (params: data) => {
    const data: any = {
        ...params,
        createTime: Date.now(),
    }
    return FileManage.save({ data })
}