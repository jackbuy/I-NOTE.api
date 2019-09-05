/**
 * socket 消息推送
 * author: zhaozj
 */

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const Schema = require('../schema');
const { Message } = Schema;

server.listen(3000); // websocket server

let onlineUser: any = []; // 在线用户

io.on('connection', (socket: any) => {

    console.log(socket.handshake.query);

    const online = (userId: string) => {
        let _index = -1;
        onlineUser.map((ele: any, index: number) => {
            if (ele.socketId === socket.id) {
                _index = index;
            }
        });
        if (_index === -1) {
            onlineUser.push({
                socketId: socket.id,
                userId: userId
            });
            io.sockets.emit('ONLINE_USER', onlineUser);
        }
    }

    const offline = () => {
        let _index = -1;
        onlineUser.map((ele: any, index: number) => {
            if (ele.socketId === socket.id) {
                _index = index;
            }
        });
        if (_index !== -1) {
            onlineUser.splice(_index, 1);
        }
        io.sockets.emit('ONLINE_USER', onlineUser);
    }

    const sendMsgCount = (userId: string) => {
        Message.find({isRead: false, toUserId: userId}).countDocuments().then((count: number) => {
            onlineUser.map((ele: any) => {
                if (ele.userId === userId) {
                    io.sockets.connected[ele.socketId].emit('MESSAGE_COUNT', count);
                }
            });
        });
    }

    // 未读消息-数量推送
    socket.on('MESSAGE_COUNT', function(userId: string) {
        if (userId) sendMsgCount(userId);
    });

    // 在线
    socket.on('ONLINE', function(userId: string) {
        if (userId) online(userId);
    });

    // 离线
    socket.on("OFFLINE", () => {
        offline();
    })

    // 监听连接断开事件
    socket.on("disconnect", () => {
        offline();
    });

});
