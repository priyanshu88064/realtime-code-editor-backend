const app = require('express')();
const server = require('http').createServer(app);

const io = require('socket.io')(server,{
    cors:{
        origin:"*"
    }
});

const port = 80;

app.get('/', (req, res) => {
    res.send("bhag bsdk");
});

io.on('connection',(socket)=>{
    console.log("A user connected.");

    socket.on("join",(roomId)=>{
        console.log("A user is joining with ID: ",roomId);
        socket.join(roomId);
    });

    socket.on("sendEditorData",(data,roomId)=>{
        socket.to(roomId).emit("getEditorData",data);
    });

    socket.on("disconnect",()=>{
        console.log("User Disconnected");
    })
});

server.listen(port,()=>{
    console.log("Server started on ",port);
});