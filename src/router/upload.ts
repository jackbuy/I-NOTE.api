import multer from 'multer';
import path from 'path';
import fs from 'fs';
import md5 from 'md5';
import { staticResouces } from '../utils/config';

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => { //文件存放目录
        let dirname = path.join(__dirname, `../../${staticResouces}`)
        fs.exists(dirname, function(exists) {
            if (!exists) fs.mkdirSync(dirname); // 判断是否存在目录，没有则创建
            cb(null, dirname)
        });
    },
    filename: (req: any, file: any, cb: any) => { //文件信息
        cb(null, new Date().getFullYear() + '' + (new Date().getMonth() == 0 ? 1 : new Date().getMonth() + 1) + '' + new Date().getDate() + '' + new Date().getHours() + '' + new Date().getMinutes() + '' + new Date().getSeconds() + md5(file.originalname) + '.' + file.originalname.toLowerCase().split('.').splice(-1)[0])
    }
});

// 上传文件 大小限制200MB
export const uploadFile = multer({
    storage: storage,
    limits: {
        fileSize: 209715200
    }
});

// 删除文件
export const delFile = (filename: any) => {
    return new Promise((resolve, reject) => {
        try {
            if (filename) fs.unlinkSync(`${staticResouces}/${filename}`);
        } catch(err) {}
        resolve();
    });
}
