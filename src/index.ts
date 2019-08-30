import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';

import { secretkey, ignoreJwtApiUrl } from './utils/config';
import router from './router';
const app = express();

//处理跨域请求
app.all("*", function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,token");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('resouces'));

app.use((req: any, res: any, next) => {
    let token = req.body.token || req.query.token || req.headers.token;
    jwt.verify(token, secretkey, (err: any, decode: any) => {
       if (err) {
        if (ignoreJwtApiUrl.includes(req.url)) { // 忽略不用token的api
            return next();
        } else {
            res.send({
                code: 401 // token验证失败，请重新登录
            })
            return;
        }
       } else {
            req.userMsg = {
                userId: decode.userId
            };
            return next();
       }
    })
})

app.use(router);

app.listen(10000, () => console.log('服务已启动，端口10000'))
