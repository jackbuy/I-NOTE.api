import jwt from 'jsonwebtoken'
import { secretkey } from './config'

/**
 * 生成token
 * @param data 
 */
export const encode = function(data: any): string {
    return jwt.sign(
        data,
        secretkey,
        // {
        //     expiresIn: 60*30  // token 30分钟过期
        // }
    );
}

/**
 * 解码
 * @param token  JWT
 */
export const decode = function(token: string): any {
    try {
        return jwt.verify(token, secretkey)
    } catch (e) {
        return null
    }
}