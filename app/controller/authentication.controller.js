const responseStatus = require("../helper/responseStatus")
const config = require("../config/global.config")
const conn = require('../helper/connetion')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const EXPIRES_IN_MINUTES = '7d'

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

async function checkUsername(username){
    return new Promise(async (resolve, reject) => {
        const [rows,fields] = await conn.query(`SELECT * FROM qr_admin
        WHERE admin_username='${username}'`);
        resolve(rows)
    })
  }

exports.notAllowed = (req, res) => {
    res.json({
        success: false,
        message: "Method Not Allowed"
    })
}

exports.loginPages = async (req, res) => {

    let session = req.session

    if (session.tokenSignIn){
        res.redirect('/admin')
    }else{
        res.render('../view/login.hbs', {
        
        });
    }
}

exports.logoutAction = async (req, res) => {
    req.session.destroy();
    res.redirect('/login')
}

exports.loginAction = async (req, res) => {
    let username = req.body.username
    let password = req.body.password

    if (username == "" || password == ""){
        req.flash('message', `Username or Password Can't be Empty!`);
        res.render('../view/login.hbs', {
            status : 1,
            type : "error",
            messageType : "danger",
            message: req.flash('message')
        });
    }else{
        let user = await checkUsername(username)
        if (user.length > 0){
            let hasPassword = user[0].admin_password
            let valid = bcrypt.compareSync(password, hasPassword)
            if (valid){

                const payload = {
                    adminId : user[0].admin_id,
                    adminName : user[0].admin_name
                }

                const signInToken = jwt.sign(payload, config.JWTSecret, {
                    expiresIn: EXPIRES_IN_MINUTES,
                })

                session=req.session;
                session.tokenSignIn=signInToken
              
                req.flash('message', `Please Wait 5 Second For Redirect to Admin Panel....`);
                res.set({'Refresh': '3; url=/admin'});
                res.render('../view/login.hbs', {
                    status : 2,
                    isDisable: "disabled",
                    type : "success ",
                    messageType : "success",
                    message: req.flash('message')
                });
                            
            }else{
                req.flash('message', `Your Password Doesn't Match`);
                res.render('../view/login.hbs', {
                    status : 1,
                    type : "error",
                    messageType : "danger",
                    message: req.flash('message')
                });
            }
        }else{
            req.flash('message', `Account Not Found`);
            res.render('../view/login.hbs', {
                status : 1,
                type : "error",
                messageType : "danger",
                message: req.flash('message')
            });
        }
    }

}