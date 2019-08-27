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
    '/user/zoneUserInfo',
    '/collect/query',
    '/follow/query',
    '/fans/query',
    '/user/recommend',
    '/topic/recommend',
    '/topic/query',
    '/topic/user/query',
    '/topic/detail',
    '/topic/article/query',
    '/sendEmail',
    '/uploadfile'
];

export default {
    name: 'I-NOTE 创造者的社区',
    // 邮件发送(15分钟过期) j**k**y z*******>
    sendCloudConfig: {
        from: '2538362801@eqAGLrzN27fwhUNO205Tdt8uSEOSDX2u.sendcloud.org',
        apiUser: 'jackbuy_test_8Wm5Vr',
        apiKey: 'XUfx4WXgipX9Arzj'
    }
}