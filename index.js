/*jslint node: true, es5: true*/
"use strict";

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    conf = require('./config.json');

server.listen(conf.port);

//deliver static content
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendfile('public/index.html');
});

io.sockets.on('connection', function (socket) {
    console.log('user connected\n');
    
    socket.emit('chat', {time: new Date(), text: 'You are now connected to the server!' });
    
    socket.on('chat', function (data) {
        io.sockets.emit('chat', {time: new Date(), name: data.name || 'Anonym', text: data.text });
    });
});

console.log('listening on *:' + conf.port + "\n");