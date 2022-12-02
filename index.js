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
        io.sockets.in(roomId).emit("newjoin",userName,allUsers,socket.id);
    });

    socket.on("codechange",(c,roomId)=>{
        socket.to(roomId).emit("codechange",c);
    });
    socket.on("inputchange",(c,roomId)=>{
        socket.to(roomId).emit("inputchange",c);
    });
    socket.on("langchange",(lang,userName,roomId)=>{
        socket.to(roomId).emit("langchange",lang,userName);
    })
    socket.on("sync",(editorData,inputData,lang,id)=>{
        io.to(id).emit("codechange",editorData);
        io.to(id).emit("inputchange",inputData);
        io.to(id).emit("langchange",lang);
    });
    
    socket.on("disconnecting",()=>{
        console.log("A user is disconnecting");

        [...socket.rooms].forEach(eachRoom=>{
            socket.to(eachRoom).emit("leave",roomData[socket.id]);
        });
        delete roomData[socket.id];
        socket.leave();
    });
});

server.listen(port,()=>{
    console.log("Server started on ",port);
});