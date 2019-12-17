import BaseModel from './baseModel';
import { Captcha } from '../schema';

class Model extends BaseModel {

    constructor(schema: any) {
        super(schema);
    }

    // 创建验证码
    create(data: any) {
      data.captcha = Math.round(900000*Math.random()+100000)
      return this.save({ data })
    }

}

export default new Model(Captcha)