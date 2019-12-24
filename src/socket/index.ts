import socketIO from 'socket.io';
import * as JWT from '../utils/jwt';
// import { unreadMessageCount } from '../router/common';

// 总连接数
let connectCount = 0,
    // 在线用户
    onlineUser: Array<object> = [],
    // 在线用户id
    onlineMember: Array<string> = [],
    // 在线游客
    onlineVisitor: Array<string> = [],
    io: any;

export default (server: any) => {

    io = socketIO.listen(server);
    // io.set('transports', ['websocket', 'xhr-polling', 'jsonp-polling', 'htmlfile', 'flashsocket']);
    // io.set('origins', 'http://127.0.0.1:4000');

    // 广播在线用户
    const updateOnline = (sockets = io.sockets) => {
        sockets.emit('ONLINE_USER', {
            // 连接数
            connect: connectCount,
            // 在线会员
            member: Array.from(new Set([...onlineMember])).length,
            // 在线游客
            visitor: Array.from(new Set([...onlineVisitor])).length
        });
    }

    // 每分钟广播一次
    setInterval(() => {
        updateOnline();
    }, 1000 * 60);

    io.on('connection', function(socket: any){

        // 获取客户端用户的id
        const { token } = socket.handshake.query;

        let userId = '';

        if (token) {
            // 解码JWT获取用户的id
            let res = JWT.decode(token);
            userId = res && res.userId ? res.userId : '';
        }

        let address = '';

        try {
            address = socket.handshake.headers["x-real-ip"];
        } catch (err) {
            address = socket.handshake.address;
            address = address.replace(/^.*:/, '');
        }

        // 获取客户端ip
        // let address = socket.handshake.address;
        // console.log(address);
        // address = address.replace(/^.*:/, '');

        if (userId) {
            onlineMember.push(userId);
            onlineUser.push({
                userId,
                socketId: socket.id
            })
        } else {
            onlineVisitor.push(address);
        }
        connectCount += 1;

        // 未读消息-数量推送
        // socket.on('UNREAD_MESSAGE_COUNT', async (toUserId: string) => {
        //     if (!toUserId) return;
        //     let count = await unreadMessageCount(toUserId);
        //     onlineUser.map((item: any) => {
        //         if (item.userId === toUserId) {
        //             io.sockets.connected[item.socketId].emit('UNREAD_MESSAGE_COUNT', count);
        //         }
        //     });
        // });

        // 监听断开事件
        socket.on('disconnect', function(res: any){

            connectCount -= 1;
            if (userId) {
                onlineMember.some((id, index)=>{
                    if (id == userId) {
                        onlineMember.splice(index, 1);
                        return true;
                    }
                    return false;
                });
                onlineUser.map((item: any, index) => {
                    if(item.userId === userId) {
                        onlineUser.splice(index, 1);
                    }
                });
            } else {
                onlineVisitor.some((ip, index)=>{
                    if (ip == address) {
                        onlineVisitor.splice(index, 1);
                        return true;
                    }
                    return false;
                });
            }

        });

        // 更新数据
        updateOnline(socket);

    });
}

// 全体广播消息
export const emit = (target: string, params?: any): void => {
    if (io) {
        io.sockets.emit(target, params)
    }
}

// 发送消息指定人
export const emitConnected = (target: string, toUserId: string, params: any): void => {
    if (io) {
        if (!toUserId) return;
        onlineUser.map((item: any) => {
            if (JSON.stringify(item.userId) === JSON.stringify(toUserId)) {
                io.sockets.connected[item.socketId].emit(target, params);
            }
        });
    }
}
