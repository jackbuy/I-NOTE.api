// mongodb数据库地址
export const DB_URL: string = 'mongodb://localhost/i-note';

// jwt的密钥
export const secretkey: string = 'secretkey';

// 忽略jwt检查的api
export const ignoreJwtApiUrl: string[] = [
    '/user/login',
    '/user/register',
    '/user/hot',
    '/article/query',
    '/article/detail',
    '/tag/query',
    '/tag/recommend',
    '/user/userInfo',
    '/collect/query',
    '/follow/query',
    '/fans/query',
    '/user/recommend',
    '/topic/recommend',
    '/topic/query',
    '/topic/detail',
    '/topic/article/query'
];