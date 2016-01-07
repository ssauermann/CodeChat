/*jslint browser: true, es5: true*/
/*global $, jQuery, alert, io, console*/
(function () {
    "use strict";

    console.log("Starting chat client");
    
    var sentCodes = [],
    
        editClickCount = 0;
    
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
        
        $('#chat').scrollTop($('#chat')[0].scrollHeight);
    }
        
    function send(socket) {
        console.log("Sending message");
        var name = $('#name').val(),
            text = $('#text').val();

        socket.emit('chat', {name: name, text: text});

        $('#text').val('');
    }
    
    function nonEditCode() {
        $('#code *').attr('contentEditable', 'false');
        $('#sendCode').addClass('disabled');
        $('#edit').removeClass('disabled');
    }
    
    function sendCode(socket) {
        console.log("Sending code");
        var name = $('#name').val(),
            code = $('#code').text();
        
        socket.emit('code', {name: name, code: code});
        nonEditCode();
    }
    
    function displayCode(code) {
        $('#code').text(sentCodes[code]);
        nonEditCode();
    }
    
    function displayCodeMessage(data) {
        console.log("Displaying message for received code");
        var time = new Date(data.time);
        $('#content').append(
            $('<li></li>').append(
                $('<span>').text(formatTime(time)),
                $('<b>').text(typeof (data.name) !== 'undefined' ? data.name + ': ' : ''),
                $('<a class="codeLink">Click here to show this code</a>').data('codeID', sentCodes.length)
            )
        );
        
        sentCodes[sentCodes.length] = data.code;
        
        $('body').scrollTop($('body')[0].scrollHeight);
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
        
        $('.main').on('click', '#sendCode', function () {
            sendCode(socket);
        });
        socket.on('code', displayCodeMessage);
        
        $('#chat').on('click', '.codeLink', function () {
            displayCode($(this).data('codeID'));
        });
    });
    
}());