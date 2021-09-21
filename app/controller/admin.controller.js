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

async function createAdmin(username, password, name) {
  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await conn.query(`INSERT INTO qr_admin (admin_username,admin_password,admin_name)
      VALUES ('${username}','${password}','${name}') `);
    resolve(rows)
  })
}

async function getData() {
  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await conn.query(`SELECT * FROM qr_data`);
    resolve(rows)
  })
}

async function getDataById(id) {
  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await conn.query(`SELECT * FROM qr_data WHERE data_id='${id}' LIMIT 1`);
    resolve(rows)
  })
}

async function insertNewData(data) {
  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await conn.query(`INSERT INTO qr_data (data_name,data_bpc,data_photo)
    VALUES ('${data.txt_fullname}','${data.txt_asal_bpc}','${data.file_name}') `);
    resolve(rows)
  })
}

async function updateQRCode(qrdata,dataId) {
  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await conn.query(`UPDATE qr_data set data_qr='${qrdata}' WHERE data_id='${dataId}'`);
    resolve(rows)
  })
}

async function deleteData(id) {
  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await conn.query(`DELETE FROM qr_data WHERE data_id='${id}'`);
    resolve(rows)
  })
}


async function updateData(data,id) {
  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await conn.query(`UPDATE qr_data set
    data_name='${data.txt_fullname}', data_bpc='${data.txt_asal_bpc}'
    WHERE data_id='${id}'`);
    resolve(rows)
  })
}

async function updateDataWithPhoto(data,id) {
  return new Promise(async (resolve, reject) => {
    const [rows, fields] = await conn.query(`UPDATE qr_data set
    data_name='${data.txt_fullname}', data_bpc='${data.txt_asal_bpc}',data_photo='${data.file_name}'
    WHERE data_id='${id}'`);
    resolve(rows)
  })
}

exports.notAllowed = (req, res) => {
  res.json({
    success: false,
    message: "Method Not Allowed"
  })
}

exports.adminPages = async (req, res) => {

  let session = req.session

  if (!session.tokenSignIn) {
    res.redirect('/login')
  } else {
    let data = await getData()
    res.render('../view/admin.hbs', {
      data: data
    });
  }


}

exports.createAdmin = async (req, res) => {
  let username, password, name
  const hash = bcrypt.hashSync("admin123", saltRounds);

  username = "admin"
  name = "Administrator"
  password = hash

  let create = await createAdmin(username, password, name)

  if (create.insertId) {
    return res.status(responseStatus.OK).json({
      success: true,
      message: 'admin created!',
    })
  } else {
    return res.status(responseStatus.forbidden).json({
      success: false,
      message: 'Create Admin Fail!.',
    })
  }
}

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './public/images/data_img')
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})

let upload = multer({ storage: storage }).single('file')
exports.addNewData = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) throw err

        const data = req.body
        const dataFile = req.file
      
        const datas = {
          txt_fullname : data.txt_fullname,
          txt_asal_bpc : data.txt_asal_bpc,
          file_name : dataFile.filename
        }

       
        let insert = await insertNewData(datas)
        if (insert.insertId){

            let encryptedData = await encrypt(`'${insert.insertId}'`)
            let updatesQR = await updateQRCode(encryptedData,insert.insertId)

            if (updatesQR.affectedRows){
                res.redirect('/admin')
            }

        }

    })  
}

exports.editData = async (req, res) => {
  upload(req, res, async (err) => {
      if (err) throw err
      
      const data = req.body
      const dataFile = req.file
      const id = req.params.id
    
    
      if (typeof req.file !== 'undefined' && req.file.filename != "") {
        
        var dir = `./public/images/data_img/${data.edt_current_photo}`;
                
        fs.unlinkSync(dir)

        const datas = {
          txt_fullname : data.edt_txt_fullname,
          txt_asal_bpc : data.edt_txt_asal_bpc,
          file_name : dataFile.filename
        }

        let update = await updateDataWithPhoto(datas,id)
        if (update.affectedRows){
          res.redirect('/admin')
        }

      } else {
        const datas = {
          txt_fullname : data.edt_txt_fullname,
          txt_asal_bpc : data.edt_txt_asal_bpc,
        }

        let update = await updateData(datas,id)
        if (update.affectedRows){
          res.redirect('/admin')
        }
      }
    
  })
}

exports.deleteData = async (req, res) => {
  let id = req.params.id
  
  let getData = await getDataById(id)
  
  var dir = `./public/images/data_img/${getData[0].data_photo}`;
                
  fs.unlinkSync(dir)

  let deleteDatas = await deleteData(id)
  if (deleteDatas.affectedRows){
    res.redirect('/admin')
  }

}