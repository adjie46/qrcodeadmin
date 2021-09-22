//IMPORT LIBRARY
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const config = require("./app/config/server.config")
const path = require('path')
const http = require('http')
const fs = require('fs')
var hbs = require('hbs');
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser')


//SET SERVER
let app = express()

//SET SERVER CORS
app.use(cors())

app.use(bodyParser.json({
    limit: '1000mb'
}))
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '1000mb'
}))

hbs.registerPartials(__dirname + '/app/view/includes/');
app.set('views', path.join(__dirname, 'app/view/'));
app.disable('views cache');
app.set('view engine', 'hbs');

hbs.registerHelper('ifEquals', function (arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper('ifNotEquals', function (arg1, arg2, options) {
    return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper("inc", function (value, options) {
    return parseInt(value) + 1;
});

app.use('/assets', express.static(__dirname + '/public', {
    etag: false
}));

app.use(session({
    cookie: {
        maxAge: Date.now() + (30 * 86400 * 1000)
    },
    secret: 'woot',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(cookieParser());

//INCLUDE ALL ROUTE
fs.readdir("./app/routes/", (err, files) => {
    if (files.length != 0) {
        files.forEach(file => {
            ("/", require("./app/routes/" + file)(app))
        });
    }
})



//START SERVER
let startServer = http.createServer(app)
    .listen(config.serverPort)

const io = require('socket.io')(startServer);

if (startServer) {
    console.log(`your server is running on port ${config.serverPort}`);
}

io.on('connection', client => {
    console.log("CONNECT");

    client.on("send", (arg) => {
        console.log(arg);
        client.emit('received',arg);
    });

});

