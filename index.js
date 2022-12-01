const app = require('express')();
const server = require('http').createServer(app);
const port = 80;
const io = require('socket.io')(server,{
    cors:{
        origin:"*"
    }
});

const roomData = new Map();

// roomData.set("a",["jfakf","faf"]);
// roomData.set("b",[...roomData.get("b"),"new"]);
// console.log(roomData.has("b"));
// console.log(roomData);

app.get('/', (req, res) => {
    res.send("bhag bsdk");
});

io.on('connection',(socket)=>{
    console.log("A user connected.");

    socket.on("join",(roomId,userName)=>{
        console.log("A user joined with ID: ",roomId);
        socket.join(roomId);

        if(roomData.has(roomId)){
            roomData.set(roomId,[...roomData.get(roomId),userName]);
        }else{
            roomData.set(roomId,[userName]);
        }
        io.sockets.in(roomId).emit("sync",roomData.get(roomId));
    });

    socket.on("sendEditorData",(data,roomId)=>{
        socket.to(roomId).emit("getEditorData",data);
    });

    socket.on("leave",(roomId,userName)=>{
        console.log("leave request recieved");
        socket.leave(roomId);
        roomData.set(roomId,roomData.get(roomId).filter(c=>userName!==c));
        socket.to(roomId).emit("sync",roomData.get(roomId));  
    });

    socket.on("disconnect",()=>{
        console.log("User Disconnected");
        console.log(roomData);
    })
});

server.listen(port,()=>{
    console.log("Server started on ",port);
});