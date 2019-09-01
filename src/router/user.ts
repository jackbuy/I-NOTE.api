import md5 from 'md5';
import jwt from 'jsonwebtoken';
import { Captcha, Follow, User } from '../model';
import { secretkey } from '../utils/config';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

// 登录
export const userLogin  = (req: any, res: any) => {
    const { email, password } = req.body;
    const query: any = {
        email,
        password: md5(password)
    }
    User.findOne({ query }).then((resp: any) => {
        if (resp) {
            const { _id, email } = resp;
            const content: any = {  // 要生成token的信息
                userId: _id,
                email: email
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
            ErrorMsg(res, { msg: '邮箱或密码错误！' });
        }
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 注册
export const userRegister  = (req: any, res: any) => {

    const { nickname, password, email, captcha } = req.body;
    const query = {
        email,
        captcha
    }
    const data: any = {
        nickname,
        email,
        password: md5(password)
    }

    Captcha.findOne({ query }).then((resp: any) => {
        return resp ? User.findOne({ query: { email } }) : Promise.reject();
    }).then((resp: any) => {
        if (!resp) {
            User.save({ data }).then(() => {
                SuccessMsg(res, {});
            }).catch(() => {
                ErrorMsg(res, {});
            });
        } else {
            ErrorMsg(res, { msg: '该邮箱已注册！' });
        }
    }).catch(() => {
        ErrorMsg(res, { msg: '无效验证码！' });
    });
}

// 空间用户信息
export const zoneUserInfo  = (req: any, res: any) => {
    const { userId, followUserId } = req.body;
    const query: any = { _id: followUserId }
    const followQuery: any = { userId, type: 0, followUserId }
    const select: string = '-password -__v -cate -lastSignAt';
    let result: any = {};

    let p1 = User.findOne({ query, select });
    let p2 = userId ? Follow.findOne({ query: followQuery }) : Promise.resolve(null);

    p1.then((resp: any) => {
        if (resp) result = resp;
        return p2;
    }).then((resp: any) => {
        if (resp) result.isFollow = true;
        SuccessMsg(res, { data: result });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 用户信息
export const userInfo  = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const query: any = { _id: userId }
    const select: string = 'username nickname gender brief avatar';

    User.findOne({ query, select }).then((resp: any) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 用户推荐
export const userRecommend = (req: any, res: any) => {
    const query: any = {};
    const currentPage: string = '1';
    const pageSize: string = '5';
    const querySort: any = { articleCount: -1 };
    const p1 = User.queryListLimit({ query, currentPage, pageSize, querySort });

    p1.then((resp: any) => {
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 编辑
export const userInfoEdit  = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const update: any = {
        ...req.body
    };
    const query: any = { _id: userId };
    User.updateOne({ query, update }).then(() => {
        SuccessMsg(res, {});
    }).catch((err: any) => {
        ErrorMsg(res, { msg: err });
    });
}