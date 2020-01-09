// mongodb数据库地址
export const DB_URL: string = 'mongodb://localhost/inote-uat';

// jwt的密钥
export const secretkey: string = 'secretkey_inote';

// 静态资源文件夹（自动创建,用于存放上传的图片）
export const staticResouces: string = 'resouces';

// 服务启动端口号，默认10000
export const serverPort: number = 10000;

// 忽略jwt检查的api
export const ignoreJwtApiUrl: string[] = [
    '/user/login',
    '/user/register',
    '/user/forget',
    '/operations/count',
    '/article/publish/query',
    '/article/publish/detail',
    '/tag/query',
    '/tag/child/query',
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
    '/sendRegisterEmail',
    '/sendForgetEmail',
    '/tag/detail',
    '/comment/query',
    '/comment/user/query',
    '/system/detail',
    '/link/query'
];

export default {
    // 系统名称(发送邮件时，用到了)
    name: 'I-NOTE 创作者的社区',
    // 邮件发送(15分钟过期) j**k**y z*******>
    sendCloudConfig: {
        from: '2538362801@eqAGLrzN27fwhUNO205Tdt8uSEOSDX2u.sendcloud.org',
        apiUser: 'jackbuy_test_8Wm5Vr',
        apiKey: 'XUfx4WXgipX9Arzj'
    },
    // 上传头像、图片文件到七牛 [必填, 否则将不支持图片上传]
    // qiniuConfig: {
    //     accessKey: 'yeHi-3z2QtuHgrY8P2voXRb89xjNWiEryRRqUXCH',
    //     secretKey: '7HKEhRCnF6fZcp5nSd_a0OByAChNdAqWblKSCNqo',
    //     bucket: '',
    //     // 七牛的资源地址
    //     url: '//img.inote.com'
    // }
}