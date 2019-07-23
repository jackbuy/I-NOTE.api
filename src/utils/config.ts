// mongodb数据库地址
export const DB_URL = 'mongodb://localhost/i-note';

// jwt的密钥
export const secretkey = 'secretkey';

// 忽略jwt检查的api
export const ignoreJwtApiUrl = [
    '/user/login',
    '/user/register',
    '/uploadfile',
    '/article/query',
    '/article/detail'
];