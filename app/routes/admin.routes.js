const adminController = require('../controller/admin.controller');


module.exports = app => {
    /* app
        .route('/api/admin')
        .get(adminController.createAdmin)
        .all(adminController.notAllowed)
 */
    app
        .route('/admin')
        .get(adminController.adminPages)
        .all(adminController.notAllowed)

    app
        .route('/addNewData')
        .post(adminController.addNewData)
        .all(adminController.notAllowed)

    app
        .route('/editData/:id')
        .post(adminController.editData)
        .all(adminController.notAllowed)

    app
        .route('/deleteData/:id')
        .get(adminController.deleteData)
        .all(adminController.notAllowed)
        
}