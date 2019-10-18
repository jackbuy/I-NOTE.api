import md5 from 'md5';
import { Captcha, Follow, User } from '../model';
import { encode } from '../utils/jwt';
import { getNewMessageCount } from './common';
import { emit } from '../socket';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

// 登录
export const userLogin  = (req: any, res: any) => {
    const { email, password, type } = req.body;
    const query: any = {
        email,
        password: md5(password)
    }
    if (type) query.level = 1000;
    const userFind = User.findOne({ query });

    userFind.then((resp: any) => {
        if (resp) {
            const { _id, email } = resp;
            const token = encode({ userId: _id, email });
            SuccessMsg(res, { data: { token: token, userId: _id } });
        } else {
            ErrorMsg(res, { msg: '邮箱或密码错误！' });
        }
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 注册
export const userRegister  = async (req: any, res: any) => {
    const { nickname, password, email, captcha } = req.body;
    const userQuery: any = {
        email
    };
    const captchaQuery: any = {
        ...userQuery,
        captcha
    };
    const userData: any = {
        nickname,
        email,
        password: md5(password)
    };

    try {

        const captcha = await Captcha.findOne({ query: captchaQuery });

        if (captcha) {
            const user = await User.findOne({ query: userQuery });
            if (!user) {
                await User.save({ data: userData });
                SuccessMsg(res, {});
            } else {
                ErrorMsg(res, { msg: '该邮箱已注册！' });
            }
        } else {
            ErrorMsg(res, { msg: '无效验证码！' });
        }

    } catch(e) {
        ErrorMsg(res, {});
    }

}

// 空间用户信息
export const zoneUserInfo  = (req: any, res: any) => {
    const { userId, followUserId } = req.body;
    const userQuery: any = { _id: followUserId }
    const followQuery: any = { userId, type: 0, followUserId }
    const select: string = '-password -__v -cate -lastSignAt';

    const userFind = User.findOne({ query: userQuery, select });
    const followFind = userId ? Follow.findOne({ query: followQuery }) : Promise.resolve(null);

    let result: any = {};

    userFind.then((resp: any) => {
        if (resp) result = resp;
        return followFind;
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
    const select: string = 'username nickname gender brief avatar theme';
    let userInfo = {};

    const userFind = User.findOne({ query, select });

    userFind.then((resp: any) => {
        userInfo = resp;
        return getNewMessageCount(userId);
    }).then((resp) => {
        emit('NEW_MSG', {
            type: 'newMsg',
            data: {
                toUserId: userId,
                msgCount: resp
            }
        });
        SuccessMsg(res, { data: userInfo });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 编辑
export const userInfoEdit  = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const query: any = { _id: userId };
    const update: any = {
        ...req.body
    };

    const userUpdate = User.updateOne({ query, update });

    userUpdate.then(() => {
        SuccessMsg(res, {});
    }).catch((err: any) => {
        ErrorMsg(res, { msg: err });
    });
}

// 公开用户列表
export const userPublishQuery = async (req: any, res: any) => {
    const { keyword, currentPage, pageSize } = req.body;
    const query: any = { };
    if (keyword) {
        const reg = new RegExp(keyword, 'i') //不区分大小写
        query.$or = [ //多条件，数组
            { nickname: { $regex: reg } }
        ]
    }
    const querySort: any = { articleCount: -1, fansCount: -1 };
    const select: string = 'nickname avatar articleCount followCount fansCount';

    try {
        const result = await User.queryListLimit({ query, currentPage, pageSize, select, querySort });

        SuccessMsg(res, { data: result });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 用户列表
export const userQuery = async (req: any, res: any) => {
    const { keyword, currentPage, pageSize } = req.body;
    const query: any = { };
    if (keyword) {
        const reg = new RegExp(keyword, 'i') //不区分大小写
        query.$or = [ //多条件，数组
            { nickname: { $regex: reg } }
        ]
    }
    const querySort: any = { articleCount: -1, fansCount: -1 };
    const select: string = '-__v -password -theme -isFollow';

    try {
        const result = await User.queryListLimit({ query, currentPage, pageSize, select, querySort });

        SuccessMsg(res, { data: result });
    } catch(e) {
        ErrorMsg(res, {});
    }
}