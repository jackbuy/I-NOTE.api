import md5 from 'md5';
import jwt from 'jsonwebtoken';
import User from '../model/user';
import { SuccessMsg, ErrorMsg } from '../utils/utils';
import { secretkey } from '../utils/config';

// 登录
export const userLogin  = (req: any, res: any) => {
    const { username, password } = req.body;
    const query: any = {
        username,
        password: md5(password)
    }
    User.findOne(query).then((resp: any) => {
        if (resp) {
            const { _id, username } = resp;
            const content: any = {  // 要生成token的主题信息
                userId: _id,
                userName: username
            };
            const token: any = jwt.sign(
                content,
                secretkey,
                // {
                //     expiresIn: 60*1  // token1分钟过期
                // }
            );
            SuccessMsg(res, { data: { token: token, userId: _id } });
        } else {
            ErrorMsg(res, { msg: '账号或密码错误！' });
        }
    });
}

// 注册
export const userRegister  = (req: any, res: any) => {
    const { username, password } = req.body;
    const data: any = {
        username,
        password: md5(password)
    }
    User.findOne({ username }).then((resp: any) => {
        if (!resp) {
            User.save(data).then(() => {
                SuccessMsg(res, {});
            });
        } else {
            ErrorMsg(res, { msg: '账号已存在' });
        }
    });
}


// 用户信息
export const userInfo  = (req: any, res: any) => {
    const { userId } = req.body;
    const query: any = { _id: userId }
    const select: string = 'username createTime';
    User.findOne({ query, select }).then((resp: any) => {
        SuccessMsg(res, { data: resp });
    }).catch((err) => {
        ErrorMsg(res, { msg: err });
    });
}
