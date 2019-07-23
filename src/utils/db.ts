/**
 * db
 * @author: zhaozj
 */
import mongoose from 'mongoose'
import { DB_URL } from '../utils/config';

mongoose.connect( DB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
// or
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);

/**
  * 连接成功
  */
mongoose.connection.on('connected', (): void => {    
    console.log('数据库连接成功...');  
});    

/**
 * 连接异常
 */
mongoose.connection.on('error',(err): void =>{    
    console.log('数据库连接出现异常 error: ' + err);  
});    
 
/**
 * 连接断开
 */
mongoose.connection.on('disconnected', ():void => {    
    console.log('数据库连接断开。');  
}); 
