const io = require('socket.io')(process.env.PORT || 3000, {
    cors: {
        origin: "*"
        // methods: ["GET", "POST"]
    }
}); 

const users = {}

io.on('connection', socket => {

    socket.on('newUserJoined', name => {
        console.log("User joined: ", name)
        users[socket.id] = name;
        socket.broadcast.emit("userJoined", name);
    });

    socket.on('newMsg', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    });

});