import express from 'express';
import bodyParser from 'body-parser';
import router from './router';
import socket from './socket';
import { decode } from './utils/jwt';
import { staticResouces, ignoreJwtApiUrl, serverPort } from './utils/config';

const app = express();

//处理跨域请求
app.all("*", function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,token");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    // res.header("Content-Type", "application/json;charset=utf-8"); // 加上后，在加载静态资源图片时会乱码
    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(staticResouces)); // 静态资源目录 http://localhost:10000/xxxx.png
// app.use('/files', express.static(staticResouces)) // 静态资源目录 - 虚拟一个files目录 http://localhost:10000/files/xxxx.png

app.use((req: any, res: any, next) => {
    const token: string = req.body.token || req.query.token || req.headers.token;
    const decodeMsg: any = decode(token);
    if (decodeMsg) {
        req.userMsg = {
            userId: decodeMsg.userId
        };
        return next();
    } else {
        if (ignoreJwtApiUrl.includes(req.url)) { // 忽略不使用token的api
            return next();
        } else {
            res.json({
                code: 401 // token验证失败，请重新登录
            })
            return;
        }
    }
})

app.use(router);

const server = app.listen(serverPort, () => console.log(`服务已启动，端口${serverPort}`))

socket(server);
