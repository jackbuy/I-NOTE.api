import multer from 'multer';
import path from 'path';
import md5 from 'md5';
import { SuccessMsg, ErrorMsg } from '../utils/utils';

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => { //文件存放目录
        cb(null, path.join(__dirname, '../../resouces'))
    },
    filename: (req: any, file: any, cb: any) => { //文件信息
        cb(null, new Date().getFullYear() + '' + (new Date().getMonth() == 0 ? 1 : new Date().getMonth()) + '' + new Date().getDate() + '' + new Date().getHours() + '' + new Date().getMinutes() + '' + new Date().getSeconds() + md5(file.originalname) + '.' + file.originalname.toLowerCase().split('.').splice(-1)[0])
    }
});

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 209715200
    }
}); //上传文件大小限制200MB

export const uploadFunc  = (req: any, res: any) => {
    if (req.files.length <= 0 || req.files == null) return ErrorMsg(res, {});
    SuccessMsg(res, { data: req.files });
}
