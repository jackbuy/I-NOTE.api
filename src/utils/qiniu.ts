
// import qiniu from 'qiniu';
// import config from './config'

// let qiniuConfig = config.qiniuConfig;

// const { accessKey, secretKey, zone } = qiniuConfig;

// const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
// const options = {
//     scope: zone
// };
// const putPolicy = new qiniu.rs.PutPolicy(options);
// const uploadToken = putPolicy.uploadToken(mac);

// // 第二步：构建配置config 上传对应的空间地区
// var config = new qiniu.conf.Config();
// config.zone = qiniu.zone.Zone_z2; //华南
// var formUploader = new qiniu.form_up.FormUploader(config);
// var putExtra = new qiniu.form_up.PutExtra();
