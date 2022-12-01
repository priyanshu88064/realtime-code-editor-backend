const app = require('express')();
const server = require('http').createServer(app);
const port = 80;
const io = require('socket.io')(server,{
    cors:{
        origin:"*"
    }
});

const roomData = {};

io.on('connection',(socket)=>{

    console.log("A user connected.");

    socket.on("join",(roomId,userName)=>{
        socket.join(roomId);
        roomData[socket.id]=userName;        
        const allUsers = [...io.sockets.adapter.rooms.get(roomId)].map(id=>roomData[id]);
        io.sockets.in(roomId).emit("newjoin",userName,allUsers);
    });
    
    socket.on("disconnecting",()=>{
        console.log("A user is disconnecting");

        [...socket.rooms].forEach(eachRoom=>{
            socket.to(eachRoom).emit("leave",roomData[socket.id]);
        });
        delete roomData[socket.id];
        socket.leave();
    })
});

server.listen(port,()=>{
    console.log("Server started on ",port);
});