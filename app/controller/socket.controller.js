const responseStatus = require("../helper/responseStatus")
const conn = require('../helper/connetion')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const multer = require('multer')
const path = require('path')
const {decrypt,encrypt } = require('../helper/encryption')
const fs = require('fs')


const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports = function(io, param2) {
    io.on('connection', client => {
        console.log("CONNECT");
    
        client.on("send", (arg) => {
    
            let data = decrypt(arg)
            console.log(data);
            client.broadcast.emit('received', data);
        });
    
    });
}