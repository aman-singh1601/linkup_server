const { Server} = require('socket.io');

const io = new Server(3001, {
    cors: {
        origin: '*',
    }
})


module.exports = {io};