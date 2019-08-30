import { send } from "../utils/email";
import Captcha from "../model/captcha";
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

// 发送邮件
export const sendEmail = (req: any, res: any) => {
    const { email } = req.body;
    const code = '848123';
    const params = {
        to: email,
        subject: '新用户注册验证码', // 标题
        text: `验证码：${code} 有效时间：15分钟`, // 内容
        html: ''
    };
    const data = {
        email,
        captcha: code,
        createTime: Date.now()
    };

    send(params).then(() => {
        return Captcha.save(data)
    }).then((resp: any) => {
        SuccessMsg(res, { data: resp });
    }).catch((err: any) => {
        ErrorMsg(res, { msg: err });
    });
}