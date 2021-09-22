//client.js
var io = require('socket.io-client');
var socket = io.connect('http://qrcode.muslimdigital.id', {reconnect: true});

// Add a connect listener
socket.on('connect', function (socket) {
    console.log('Connected!');
});
socket.emit("send", "world");
