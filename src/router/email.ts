import { send } from "../utils/email";
import { Captcha, User } from "../model";
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

// 发送邮件
export const sendEmail = (req: any, res: any) => {
    const { email } = req.body;
    const code = Math.round(900000*Math.random()+100000);
    const params = {
        to: email,
        subject: '新用户注册验证码', // 标题
        text: `请输入验证码 ${code} 完成账号注册，有效时间：15分钟。`, // 内容
        html: ''
    };
    const data = {
        email,
        captcha: code,
        createTime: Date.now()
    };

    User.findOne({ query: { email } }).then((resp) => {
        if (!resp) {
            send(params).then(() => {
                return Captcha.save({ data })
            }).then((resp: any) => {
                SuccessMsg(res, {});
            }).catch((err: any) => {
                ErrorMsg(res, { msg: '验证码发送失败' });
            });
        } else {
            ErrorMsg(res, { msg: '邮箱已注册！' });
        }
    });
}