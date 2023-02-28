/**
 * Module exports a JWT authentication route handler.
 * 
 * @module controllers/jwt
 * @see strategies/jwt
 */


const passport = require('koa-passport');

const jwtAuth = require('../strategies/jwt');

passport.use(jwtAuth);

/**
 * Exports a route handler for JWT authentication.
 */
module.exports = passport.authenticate(['jwt'], {session:false}); 