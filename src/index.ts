import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';

import { secretkey, ignoreJwtApiUrl } from './utils/config';
import routerApi from './api'
import './utils/db';
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
app.use(express.static('resouces')); // 指定文件夹 http://localhost:8081/xxxx.jpg, resouces 静态资源文件夹
app.use((req: any, res: any, next) => {
    // 定义 不用token 的api
    if (ignoreJwtApiUrl.includes(req.url)) return next();

    //定义 用token的api  对其验证
    let token = req.body.token || req.query.token || req.headers.token; //token可能存在post请求和get请求
    jwt.verify(token, secretkey, (err: any, decode: any) => {
       if (err) {
           res.send({
            //    msg: 'token验证失败，请重新登录',
               code: '403'
           })
           return;
       } else {
            req.userMsg = {
                userId: decode.userId
            };
            return next();
       }
    })
})

app.use(routerApi);

app.listen(10000, (): void => {
    console.log('服务已启动，端口10000');
})