
const CryptoJS = require("crypto-js");
const JsFormat = require("./jsonFormater");
const config = require('../config/global.config');

function decrypt(data){
    var input = data;
    var encrypted = CryptoJS.AES.decrypt(input, config.JWTSecret, {
        format: JsFormat.JsonFormatter
    });
    var decrypted = JSON.parse(encrypted.toString(CryptoJS.enc.Utf8));
    //#if using base64encode
    //var base64 = JSON.parse(CryptoJS.enc.Base64.parse(decrypted).toString(CryptoJS.enc.Utf8));
    return (decrypted);
}

module.exports = decrypt