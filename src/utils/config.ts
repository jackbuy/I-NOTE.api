// mongodb数据库地址
// export const DB_URL: string = 'mongodb://localhost/inote-dev';
export const DB_URL: string = 'mongodb://localhost/inote-uat';

// jwt的密钥
export const secretkey: string = 'secretkey_inote';

// 静态资源文件夹
export const staticResouces: string = 'resouces';

// 忽略jwt检查的api
export const ignoreJwtApiUrl: string[] = [
    '/user/login',
    '/user/register',
    '/article/publish/query',
    '/article/publish/detail',
    '/tag/query',
    '/tag/recommend',
    '/user/zoneUserInfo',
    '/collect/query',
    '/follow/user/query',
    '/follow/topic/query',
    '/follow/tag/query',
    '/fans/query',
    '/user/publish/query',
    '/topic/recommend',
    '/topic/query',
    '/topic/user/query',
    '/topic/detail',
    '/topic/article/query',
    '/sendEmail',
    '/tag/detail',
    '/comment/query'
];

export default {
    name: 'I-NOTE 创作者的社区',
    // 邮件发送(15分钟过期) j**k**y z*******>
    sendCloudConfig: {
        from: '2538362801@eqAGLrzN27fwhUNO205Tdt8uSEOSDX2u.sendcloud.org',
        apiUser: 'jackbuy_test_8Wm5Vr',
        apiKey: 'XUfx4WXgipX9Arzj'
    }
}