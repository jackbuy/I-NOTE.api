import md5 from 'md5';
import jwt from 'jsonwebtoken';
import { User } from '../schema';
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
                    // expiresIn: 60*1  // 1分钟过期
                    // expiresIn: 60*60*1  // 1小时过期
                // }
            );
            SuccessMsg(res, { data: {token: token, userId: _id} });
        } else {
            ErrorMsg(res, { msg: '账号或密码错误！'});
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
    User.find({username}).then((resp: any) => {
        if (resp.length > 0) {
            ErrorMsg(res, { msg: '账号已存在'});
        } else {
            new User(data).save().then(() => {
                SuccessMsg(res, {});
            });
        }
    });
}

// 检查用户是否已登录
export const CheckUserIsLogin  = (req: any, res: any) => {
    const { userId } = req.userMsg;
    User.findById(userId).then((resp: any) => {
        if(resp) {
            SuccessMsg(res, { data: true })
        } else {
            SuccessMsg(res, { data: false })
        }
    });
}

// 已登录用户详情
export const userLoginDeteil  = (req: any, res: any) => {
    const { userId } = req.userMsg;
    User.findById(userId, 'username').then((resp: any) => {
        SuccessMsg( res, { data: resp} );
    });
}

// 用户详情
export const userDeteil  = (req: any, res: any) => {
    const { userId } = req.params;
    User.findById(userId, 'username').then((resp: any) => {
        SuccessMsg( res, { data: resp} );
    });
}

export const userQuery  = (req: any, res: any) => {
    res.send('userQuery')
}

export const userEdit  = (req: any, res: any) => {
    res.send('edit')
}

export const userDelete  = (req: any, res: any) => {
    res.send('delete')
}
