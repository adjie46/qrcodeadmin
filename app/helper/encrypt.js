
const CryptoJS = require("crypto-js");
const JsFormat = require("./jsonFormater");
const config = require('../config/db.config');

function encrypt(data){
    var encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), config.JWTSecret, {
        format: JsFormat.JsonFormatter
    }).toString();
    return (encrypted);
}

module.exports = encrypt