require('dotenv').config()

module.exports = {
    UserAgent : process.env.USER_AGENT,
    UserAgentDev : process.env.USER_AGENT_POSTMAN,
    JWTSecret: process.env.JWT_SECRET
}