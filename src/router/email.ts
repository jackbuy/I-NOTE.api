import { send } from "../utils/email";
import { Captcha, User } from "../model";
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

// 发送注册邮件
export const sendRegisterEmail = async (req: any, res: any) => {
    const { email } = req.body;
    const data: any = {
        type: 0,
        email,
        createTime: Date.now()
    };
    const captchaQuery: any = {
        email,
        type: 0
    };
    let captchaCode: any; // 验证码

    try {
        // 检查邮箱是否已注册
        const isRegister: any = await User.findOne({ query: { email } });
        if (isRegister) return ErrorMsg(res, { msg: '邮箱已注册！' });
        // 检查验证码是否已创建
        const isCaptcha: any = await Captcha.findOne({query: captchaQuery});
        if (!isCaptcha) {
            const result: any = await Captcha.create(data);
            const { captcha } = result;
            captchaCode = captcha;
        } else {
            const { captcha } = isCaptcha;
            captchaCode = captcha;
        }
        const params: any = {
            to: email,
            subject: '新用户注册验证码', // 标题
            text: `请输入验证码 ${captchaCode} 完成账号注册，有效时间：15分钟。`, // 内容
            html: ''
        };
        await send(params);
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, { msg: '验证码发送失败' });
    }
}


// 发送忘记密码邮件
export const sendForgetEmail = async (req: any, res: any) => {
    const { email } = req.body;
    const data: any = {
        type: 1,
        email,
        createTime: Date.now()
    };
    const captchaQuery: any = {
        email,
        type: 1
    };
    let captchaCode: any; // 验证码

    try {
        // 检查邮箱是否已注册
        const isRegister: any = await User.findOne({ query: { email } })
        if (!isRegister) return ErrorMsg(res, { msg: '邮箱未注册或无效！' });
        // 检查验证码是否已创建
        const isCaptcha: any = await Captcha.findOne({query: captchaQuery});
        if (!isCaptcha) {
            const result: any = await Captcha.create(data);
            const { captcha } = result;
            captchaCode = captcha;
        } else {
            const { captcha } = isCaptcha;
            captchaCode = captcha;
        }
        const params: any = {
            to: email,
            subject: '重置密码验证码', // 标题
            text: `请输入验证码 ${captchaCode} 完成重置密码，有效时间：15分钟。`, // 内容
            html: ''
        };
        await send(params);
        SuccessMsg(res, {});
    } catch(e) {
        ErrorMsg(res, { msg: '验证码发送失败' });
    }
}