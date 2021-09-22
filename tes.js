//client.js
var io = require('socket.io-client');
var socket = io.connect('http://localhost:8080', {reconnect: true});

// Add a connect listener
socket.on('connect', function (socket) {
    console.log('Connected!');
});
socket.emit("send", "7e5896f5c5cd51b80cf07c33eae97ce3:e6447e005ea8f5d4649de36ee59f084a");
