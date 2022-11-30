const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = 80;

app.get('/', (req, res) => {
    res.send("fjakjfdkj");
});

server.listen(port,()=>{
    console.log("Server started on ",port);
})