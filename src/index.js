const express = require('express');
const app = express();
const path = require('path');
const crypto = require('crypto');

const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose'); // 수정된 부분
const server = http.createServer(app);
const port = 4000;

const io = new Server(server);

const publicDirectory = path.join(__dirname, '../public');
app.use(express.static(publicDirectory));
app.use(express.json());

mongoose.connect('mongodb+srv://admin:1234@express-cluster.tjxac.mongodb.net/?retryWrites=true&w=majority&appName=express-cluster')
    .then(() => console.log('DB 연결 성공'))
    .catch(err => console.error(err)); // 수정된 부분


const randomId = () => crypto.randomBytes(8).toString('hex');

app.post('/session', (req, res) => {
    const data = {
        username: req.body.username,
        userID: randomId()
    }
    console.log("Data : ", data);

    res.send(data);
})

io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    const userID = socket.handshake.auth.userID;

    if(!username) {
        return next(new Error('Invalid username'));
    }

    socket.username = username;
    socket.id = userID;

    next();
})

let users = [];
io.on('connection', async socket => {

    let userData = {
        username: socket.username,
        userID: socket.id
    };
    users.push(userData);
    io.emit('users-data', { users });

    // 클라이언트에서 보내온 메시지
    socket.on('message-to-server', () => {

    });

    // 데이터베이스에서 메시지 가져오기
    socket.on('fetch-messages', () => {

    });

    // 유저가 방에서 나갔을 때
    socket.on('disconnect', () => {

    });
});

server.listen(port, () => {
    console.log('Server is up on port ' + port);
});
