/*jslint browser: true, es5: true*/
/*global $, jQuery, alert, io, console, hljs, Worker, Dropzone, FileReader*/
(function () {
    "use strict";

    console.log("Starting chat client");
    
    var sentCodes = [];
        
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
    
    function updateHighlight() {
        var code = $('#code'),
            worker = new Worker('highlightjs/worker.js');
        worker.onmessage = function (event) {
            code.html(event.data);
        };
        worker.postMessage(code.text());
    }
    
    function editCode() {
        $('#code').attr('contentEditable', 'true');
        $('#sendCode').removeClass('disabled');
        $('#edit').addClass('disabled');
        updateHighlight();
    }
    
    function nonEditCode() {
        $('#code').attr('contentEditable', 'false');
        $('#sendCode').addClass('disabled');
        $('#edit').removeClass('disabled');
        updateHighlight();
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
    
    function initDropzone() {
        
        function handleDrop(event) {
            event.preventDefault();
            
            $(event.currentTarget).css('outline', 'none');
            
            var files = event.originalEvent.dataTransfer.files,
                        
                reader = new FileReader();
                        
            reader.onload = (function (file) {
                console.log(file.name);
                return function (e) {
                    $('#snippetTitle').val(file.name);
                    $('#code').text(reader.result);
                    
                    editCode();
                };
            }(files[0]));
            
            reader.readAsText(files[0]);
            
        }
        
        function handleDragOver(event) {
            event.stopPropagation();
            event.preventDefault();
        }
        
        function handleDragEnter(event) {
            event.stopPropagation();
            event.preventDefault();
            $(event.currentTarget).css('outline', '4px solid #0B85A1');
        }
                
        var dropZone = $('.main pre');
        
        $(document).on('dragenter', function (e) {
            e.stopPropagation();
            e.preventDefault();
        });
        $(document).on('dragover', function (e) {
            e.stopPropagation();
            e.preventDefault();
            dropZone.css('outline', '4px dotted #0B85A1');
        });
        $(document).on('drop', function (e) {
            e.stopPropagation();
            e.preventDefault();
            dropZone.css('outline', 'none');
        });
        $("document").on('dragleave', function (e) {
            e.stopPropagation();
            e.preventDefault();
            dropZone.css('outline', 'none');
        });
        
        dropZone.on('dragenter', handleDragEnter);
        dropZone.on('dragover', handleDragOver);
        dropZone.on('drop', handleDrop);
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
        
        $('#code').on('blur', updateHighlight);
        
        initDropzone();
        
    });
    
}());