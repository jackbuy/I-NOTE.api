import md5 from 'md5';
import { Captcha, Follow, User } from '../model';
import { encode } from '../utils/jwt';
import { articlePublishCount, topicCount, userCount, unreadMessageCount, unreadLetterCount } from '../router/common';
import { emitConnected } from '../socket';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

// 登录
export const userLogin = async (req: any, res: any) => {
    const { email, password, type } = req.body;
    const query: any = {
        email,
        password: md5(password)
    }
    if (type) query.level = 1000;

    try {
        const isHas: any = await User.findOne({ query });
        if (isHas) {
            const { _id, email } = isHas;
            const token = encode({ userId: _id, email });
            // 更新登录时间
            await User.updateOne({
                query: { _id },
                update: { lastSignAt: Date.now() }
            })
            SuccessMsg(res, { data: { token: token, userId: _id } });
        } else {
            ErrorMsg(res, { msg: '邮箱或密码错误！' });
        }
    } catch(e) {
        ErrorMsg(res, { msg: '登录失败！' });
    }
}

// 注册
export const userRegister = async (req: any, res: any) => {
    const { nickname, password, email, captcha } = req.body;
    const userQuery: any = {
        email
    };
    const captchaQuery: any = {
        ...userQuery,
        captcha,
        type: 0
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

// 忘记密码
export const userForget = async (req: any, res: any) => {
    const { password, email, captcha } = req.body;
    const userQuery: any = {
        email
    };
    const captchaQuery: any = {
        email,
        captcha,
        type: 1
    };
    const update: any = {
        password: md5(password)
    };

    try {
        const captcha = await Captcha.findOne({ query: captchaQuery });
        if (captcha) {
            const user = await User.findOne({ query: userQuery });
            if (user) {
                await User.updateOne({ query: userQuery, update });
                SuccessMsg(res, {});
            } else {
                ErrorMsg(res, { msg: '邮箱未注册！' });
            }
        } else {
            ErrorMsg(res, { msg: '无效验证码！' });
        }
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 空间用户信息
export const zoneUserInfo = async (req: any, res: any) => {
    const { userId, followUserId } = req.body;
    const userQuery: any = { _id: followUserId }
    const followQuery: any = { userId, type: 0, followUserId }
    const select: string = '-password -__v -cate -lastSignAt';

    try {
        const result: any = await User.findOne({ query: userQuery, select });
        if (userId) {
            const isHas: any = await Follow.findOne({ query: followQuery })
            result._doc.isFollow = isHas ? true : false;
        }
        SuccessMsg(res, { data: result });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 用户信息
export const userInfo = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const query: any = { _id: userId }
    const select: string = 'username nickname gender brief avatar theme level';

    try {
        const result: any = await User.findOne({ query, select });
        if (result) {
            const messageCount = await unreadMessageCount(userId);
            const letterCount = await unreadLetterCount(userId);
            emitConnected('UNREAD_MESSAGE_COUNT', userId, { count: messageCount });
            emitConnected('UNREAD_LETTER_COUNT', userId, { count: letterCount });
        }
        SuccessMsg(res, { data: result });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 编辑
export const userInfoEdit = async (req: any, res: any) => {
    const { userId } = req.userMsg;
    const query: any = { _id: userId };
    const update: any = {
        ...req.body
    };

    try {
        await User.updateOne({ query, update });
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, {});
    }
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
    const select: string = '-__v -password -theme';

    try {
        const result = await User.queryListLimit({ query, currentPage, pageSize, select, querySort });
        SuccessMsg(res, { data: result });
    } catch(e) {
        ErrorMsg(res, {});
    }
}

// 数量统计
export const operationsCount = async (req: any, res: any) => {
    let result: any = {};

    try {
        result.articlePublishCount = await articlePublishCount();
        result.topicCount = await topicCount();
        result.userCount = await userCount();
        SuccessMsg(res, { data: result });
    } catch(e) {
        ErrorMsg(res, {});
    }
}