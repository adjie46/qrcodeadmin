const authenticationController = require('../controller/authentication.controller');


module.exports = app => {
    app
        .route('/login')
        .get(authenticationController.loginPages)
        .post(authenticationController.loginAction)
        .all(authenticationController.notAllowed)

    app
        .route('/')
        .get(authenticationController.loginPages)
        .all(authenticationController.notAllowed)

    app
        .route('/logout')
        .post(authenticationController.logoutAction)
        .all(authenticationController.notAllowed)
}