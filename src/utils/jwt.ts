import jwt from 'jsonwebtoken'
import { secretkey } from './config'

export const encode = function(data: any): string {
    return jwt.sign(data, secretkey);
}

/**
 * 解码
 * @param token  JWT
 */
export const decode = function(token: string): any {
    try {
        return jwt.verify(token, secretkey)
    } catch (e) {
        // console.log(e)
        return null
    }
}