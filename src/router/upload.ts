import multer from 'multer';
import path from 'path';
import fs from 'fs';
import md5 from 'md5';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => { //文件存放目录
        let dirname = path.join(__dirname, '../../resouces')
        fs.exists(dirname, function(exists) {
            if (!exists) fs.mkdirSync(dirname); // 判断是否存在目录，没有则创建
            cb(null, dirname)
        });
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

export const deleteFile  = (req: any, res: any) => {
    const { filename } = req.body;
    try {
        if (filename) fs.unlinkSync('resouces/' + filename);
    } catch(err) {}
    SuccessMsg(res, {});
}
