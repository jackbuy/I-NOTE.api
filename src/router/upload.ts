import multer from 'multer';
import path from 'path';
import fs from 'fs';
import md5 from 'md5';
import Utils from '../utils/utils';
import { fileSave } from './fileManage';
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
        cb(null, new Date().getFullYear() + '' + (new Date().getMonth() == 0 ? 1 : new Date().getMonth() + 1) + '' + new Date().getDate() + '' + new Date().getHours() + '' + new Date().getMinutes() + '' + new Date().getSeconds() + md5(file.originalname) + '.' + file.originalname.toLowerCase().split('.').splice(-1)[0])
    }
});

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 209715200
    }
}); //上传文件大小限制200MB

export const delFile = (filename: any) => {
    return new Promise((resolve, reject) => {
        try {
            if (filename) fs.unlinkSync('resouces/' + filename);
        } catch(err) {}
        resolve();
    });
}

// 头像、专题上传
export const uploadFile = (req: any, res: any) => {
    const { files } = req;
    if (files.length <= 0 || files == null) return ErrorMsg(res, {});
    SuccessMsg(res, { data: files });
}

// 多文件删除
export const multiFileUpload = () => {}

// 单文件上传
export const singleFileUpload = (req: any, res: any) => {
    const { files } = req;
    const { type } = req.body;
    const { userId } = req.userMsg;
    const { originalname, filename, mimetype, size } = files[0];
    const params = {
        name: originalname,
        filename,
        size,
        type,
        mimetype,
        userId
    }
    if (req.files.length <= 0 || req.files == null) return ErrorMsg(res, {});
    fileSave(params).then(() => { // 存入数据库
        SuccessMsg(res, { data: filename });
    })
}

// 单文件删除
export const deleteFile = (req: any, res: any) => {
    const { filename } = req.body;
    delFile(filename).then(() => {
        SuccessMsg(res, {});
    });
}

