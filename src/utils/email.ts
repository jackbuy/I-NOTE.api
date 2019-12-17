
import config from './config'
import SendCloud from 'sendcloud-client';

let sendCloudConfig = config.sendCloudConfig;
let client: any

if (sendCloudConfig &&
    sendCloudConfig.from &&
    sendCloudConfig.apiUser &&
    sendCloudConfig.apiKey
    ) {
    client = SendCloud.create({
        from: config.name+' <'+sendCloudConfig.from+'>',
        apiUser: sendCloudConfig.apiUser,
        apiKey: sendCloudConfig.apiKey
    });
}

interface Param {
    to: string
    subject: string
    text: string
    html: string
}

export const send = (param: Param): Promise<any> => {
    return new Promise((resolve: any, reject: any)=>{

        if (!client) {
            return reject('没有配置SendCloud')
        }

        let res = client.send({
            to: [param.to],
            subject: param.subject,
            html: param.html || param.text
        });

        if (res.message == 'success') {
            resolve();
        } else {
            reject(JSON.stringify(res));
        }

    })
}
