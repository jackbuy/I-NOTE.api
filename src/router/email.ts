import { send } from "../utils/email";
import { Captcha, User } from "../model";
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

// 发送注册邮件
export const sendRegisterEmail = (req: any, res: any) => {
    const { email } = req.body;
    const code: number = Math.round(900000*Math.random()+100000);
    const params: any = {
        to: email,
        subject: '新用户注册验证码', // 标题
        text: `请输入验证码 ${code} 完成账号注册，有效时间：15分钟。`, // 内容
        html: ''
    };
    const data: any = {
        type: 0,
        email,
        captcha: code,
        createTime: Date.now()
    };
    const captchaQuery: any = {
        email,
        type: 0
    };

    User.findOne({ query: { email } }).then((resp) => {
        if (!resp) {
            Captcha.findOne({query: captchaQuery}).then((resp) => {
                if (!resp) {
                    send(params).then(() => {
                        return Captcha.save({ data })
                    }).then((resp: any) => {
                        SuccessMsg(res, {});
                    }).catch((err: any) => {
                        ErrorMsg(res, { msg: '验证码发送失败' });
                    });
                } else {
                    ErrorMsg(res, { msg: '验证码已发送到您的邮箱！' });
                }
            })
        } else {
            ErrorMsg(res, { msg: '邮箱已注册！' });
        }
    });
}


// 发送忘记密码邮件
export const sendForgetEmail = (req: any, res: any) => {
    const { email } = req.body;
    const code: number = Math.round(900000*Math.random()+100000);
    const params: any = {
        to: email,
        subject: '重置密码验证码', // 标题
        text: `请输入验证码 ${code} 完成重置密码，有效时间：15分钟。`, // 内容
        html: ''
    };
    const data: any = {
        type: 1,
        email,
        captcha: code,
        createTime: Date.now()
    };

    const captchaQuery: any = {
        email,
        type: 1
    };

    User.findOne({ query: { email } }).then((resp) => {
        if (resp) {
            Captcha.findOne({query: captchaQuery}).then((resp) => {
                if (!resp) {
                    send(params).then(() => {
                        return Captcha.save({ data })
                    }).then((resp: any) => {
                        SuccessMsg(res, {});
                    }).catch((err: any) => {
                        ErrorMsg(res, { msg: '验证码发送失败' });
                    });
                } else {
                    ErrorMsg(res, { msg: '验证码已发送到您的邮箱！' });
                }
            })
        } else {
            ErrorMsg(res, { msg: '邮箱未注册！' });
        }
    });
}