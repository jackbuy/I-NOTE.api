import md5 from 'md5';
import { Captcha, Follow, User } from '../model';
import { encode } from '../utils/jwt';
import { emit } from '../socket';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

// 登录
export const userLogin  = (req: any, res: any) => {
    const { email, password } = req.body;
    const query: any = {
        email,
        password: md5(password)
    }
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
export const userRegister  = (req: any, res: any) => {
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

    const captchaFind = Captcha.findOne({ query: captchaQuery });
    const userFind = User.findOne({ query: userQuery });
    const userSave = User.save({ data: userData });

    captchaFind.then((resp: any) => {
        return resp ? userFind : Promise.reject();
    }).then((resp: any) => {
        if (!resp) {
            userSave.then(() => {
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
    const select: string = 'username nickname gender brief avatar';

    const emitMsg: any = (toUserId: any): void => {
        emit('NEW_MSG', {
            type: 'newMsg',
            data: {
                toUserId
            }
        });
    }

    const userFind = User.findOne({ query, select });

    userFind.then((resp: any) => {
        emitMsg(userId); // 发送消息
        SuccessMsg(res, { data: resp });
    }).catch(() => {
        ErrorMsg(res, {});
    });
}

// 用户推荐
export const userRecommend = (req: any, res: any) => {
    const query: any = {};
    const currentPage: string = '1';
    const pageSize: string = '3';
    const querySort: any = { articleCount: -1 };

    const userQuery = User.queryListLimit({ query, currentPage, pageSize, querySort });

    userQuery.then((resp: any) => {
        SuccessMsg(res, { data: resp });
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