const express = require('express');
const { io} = require('./service/service.js');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

const socketToEmailMapping = new Map();
const emailToSocketMapping = new Map();

io.on("connection", (socket) => {
    socket.on("event:join-room", ({email, roomid}) => {

        socketToEmailMapping.set(socket.id, email);
        emailToSocketMapping.set(email, socket.id);
        socket.join(roomid);
        
        //telling user that a room has been created 
        socket.emit("event:joined-room", {roomid});

        //telling the group that a user joined the room
        socket.broadcast.to(roomid).emit("event:user-joined", {email});
    })
      //taking the call
    socket.on("event:call-user", ({email, offer}) => {
    console.log("email: " + email  + " offer: " + offer);
    const fromEmail = socketToEmailMapping.get(socket.id);
    const toSocketId = emailToSocketMapping.get(email);

    socket.to(toSocketId).emit("event:incomming-call", {email: fromEmail, offer});

    });
    socket.on("event:call-accepted", ({email, ans}) => {
        // console.log("call-accepted:", email);
        const fromEmail = socketToEmailMapping.get(socket.id);
        const toSocketId = emailToSocketMapping.get(email);
        socket.to(toSocketId).emit("event:accepted", {email: fromEmail, ans});
    });
})

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});