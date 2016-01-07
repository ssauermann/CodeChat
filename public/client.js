/*jslint browser: true, es5: true*/
/*global $, jQuery, alert, io, console*/
(function () {
    "use strict";

    console.log("Starting chat client");
    
    function formatTime(time) {
        return '[' + (time.getHours() < 10 ? '0' : '') + time.getHours() + ':' +
            (time.getMinutes() < 10 ? '0' : '') + time.getMinutes() + '] ';
    }
    
    function displayMessage(data) {
        console.log("Displaying received message");
        var time = new Date(data.time);
        $('#content').append(
            $('<li></li>').append(
                $('<span>').text(formatTime(time)),
                $('<b>').text(typeof (data.name) !== 'undefined' ? data.name + ': ' : ''),
                $('<span>').text(data.text)
            )
        );
        
        $('body').scrollTop($('body')[0].scrollHeight);
    }
        
    function send(socket) {
        console.log("Sending message");
        var name = $('#name').val(),
            text = $('#text').val();

        socket.emit('chat', {name: name, text: text});

        $('#text').val('');
    }
   
    
    $(document).ready(function () {
        var socket = io.connect();
        socket.on('chat', displayMessage);
        $('#send').click(function () {
            send(socket);
        });
        $('#text').keypress(function (e) {
            
            if (e.which === 13) {
                send(socket);
            }
        });
    });
    
}());