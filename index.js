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
    
    socket.emit('chat', {time: new Date(), text: 'You are now connected to the server!'});
    socket.broadcast.emit('chat', {time: new Date(), text: 'User connected to the server!'});
    
    socket.on('chat', function (data) {
        io.sockets.emit('chat', {time: new Date(), name: data.name || 'Anonym', text: data.text });
    });
    
    socket.on('disconnect', function () {
        io.sockets.emit('chat', {time: new Date(), text: 'User disconnected from the server!'});
    });
    
    socket.on('code', function (data) {
        io.sockets.emit('code', {time: new Date(), name: data.name || 'Anonym', code: data.code, title: data.title || 'unnamed snippet' });
    });
});

console.log('listening on *:' + conf.port + "\n");