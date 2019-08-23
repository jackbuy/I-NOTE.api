import { send } from "../utils/email";
import { SuccessMsg, ErrorMsg, } from '../utils/utils';

// 发送邮件
export const sendEmail = (req: any, res: any) => {
    const params = {
        to: '2538362801@qq.com',
        subject: 'test', // 标题
        text: 'string', // 内容
        html: ''
    };
    send(params).then((resp) => {
        SuccessMsg(res, { data: resp })
    });
}