import md5 from 'md5';
import jwt from 'jsonwebtoken';
import User from '../model/user';
import Follow from '../model/follow';
import Article from '../model/article';
import Topic from '../model/topic';
import Tag from '../model/tag';
import Collect from '../model/collect';
import { secretkey } from '../utils/config';
import Utils from '../utils/utils';
const { SuccessMsg, ErrorMsg } = Utils;

// 登录
export const userLogin  = (req: any, res: any) => {
    const { username, password } = req.body;
    const query: any = {
        username,
        password: md5(password)
    }
    User.findOne({ query }).then((resp: any) => {
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
                //     expiresIn: 60*1  // token1分钟过期
                // }
            );
            SuccessMsg(res, { data: { token: token, userId: _id } });
        } else {
            ErrorMsg(res, { msg: '账号或密码错误！' });
        }
    });
}

// 注册
export const userRegister  = (req: any, res: any) => {
    const { username, password } = req.body;
    const query = { username };
    const data: any = {
        username,
        password: md5(password)
    }
    User.findOne({ query }).then((resp: any) => {
        if (!resp) {
            User.save(data).then(() => {
                SuccessMsg(res, {});
            });
        } else {
            ErrorMsg(res, { msg: '账号已存在' });
        }
    });
}

// 空间用户信息
export const zoneUserInfo  = (req: any, res: any) => {
    const { userId, followId = '' } = req.body;
    const query: any = { _id: followId }
    const select: string = '-password -__v -cate -lastSignAt';
    let result: any = {};

    User.findOne({ query, select }).then((resp: any) => {
        result = resp;
        return Follow.findOne({ query: { userId, type: 0, followId } });
    }).then((resp: any) => {
        if (resp) result.isFollow = true;
        SuccessMsg(res, { data: result });
    }).catch((err) => {
        ErrorMsg(res, { msg: err });
    });
}

// 用户信息
export const userInfo  = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const query: any = { _id: userId }
    const select: string = 'username nickname gender brief avatar';

    User.findOne({ query, select }).then((resp: any) => {
        SuccessMsg(res, { data: resp });
    }).catch((err) => {
        ErrorMsg(res, { msg: err });
    });
}

// 用户推荐
export const userRecommend = (req: any, res: any) => {
    const query: any = {};
    const select: string = 'username';
    const querySkip: number = 0;
    const querylimit: number = 5;
    const p1 = User.userRecommend({ query, select, querySkip, querylimit });

    p1.then((resp) => { SuccessMsg(res, { data: resp }); })
}

// 编辑
export const userInfoEdit  = (req: any, res: any) => {
    const { userId } = req.userMsg;
    const update: any = {
        ...req.body
    };
    const query: any = { _id: userId };
    User.updateOne({ query, update })
        .then(() => {
            SuccessMsg(res, {});
        })
        .catch((err: any) => {
            ErrorMsg(res, { msg: err });
        });
}
// 更新标签文章数量
export const updateTagArticleCount  = (tagId: string) => {
    const articleQuery: any = { tagId, publish: true };
    const query: any = { _id: tagId };
    return Article.count(articleQuery).then((resp: any) => {
        return Tag.updateOne({ query, update: { articleCount: resp } })
    });
}

// 更新用户文章数量
export const updateArticleCount  = (userId: string) => {
    const articleQuery: any = { userId, publish: true };
    const query: any = { _id: userId };
    return Article.count(articleQuery).then((resp: any) => {
        return User.updateOne({ query, update: { articleCount: resp } })
    });
}

// 更新用户专题数量
export const updateTopicCount  = (userId: string) => {
    const articleQuery: any = { userId };
    const query: any = { _id: userId };
    return Topic.count(articleQuery).then((resp: any) => {
        return User.updateOne({ query, update: { topicCount: resp } })
    });
}

// 更新用户收藏数量
export const updateCollectCount  = (userId: string) => {
    const articleQuery: any = { createUserId: userId };
    const query: any = { _id: userId };
    return Collect.count(articleQuery).then((resp: any) => {
        return User.updateOne({ query, update: { collectCount: resp } })
    });
}

// 更新用户粉丝数量
export const updateFansCount  = (userId: string) => {
    const articleQuery: any = { followId: userId, type: 0 };
    const query: any = { _id: userId };
    return Follow.count(articleQuery).then((resp: any) => {
        return User.updateOne({ query, update: { fansCount: resp } })
    });
}

// 更新用户关注数量
export const updateFollowCount  = (userId: string) => {
    const articleQuery: any = { userId };
    const query: any = { _id: userId };
    return Follow.count(articleQuery).then((resp: any) => {
        return User.updateOne({ query, update: { followCount: resp } })
    });
}