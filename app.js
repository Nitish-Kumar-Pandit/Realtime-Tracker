const express = require('express')
const app = express() 
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
 
// Use this for serving static files
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);

    // When the client sends location data
    socket.on("send-location", (coords) => {
        io.emit("receive-location", { id: socket.id, ...coords });
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id);
    });
});

app.get('/', function(req, res) {
    res.render('index');
});

server.listen(3000, function() {
    console.log("Server running on http://localhost:3000");
});
