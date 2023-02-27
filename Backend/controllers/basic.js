/**
 * Module exports a BasicAuth authentication route handler.
 * 
 * @module controllers/basic
 * @see strategies/basic
 */

const passport = require('koa-passport');

const basicAuth = require('../strategies/basic');

passport.use(basicAuth);

/**
 * Exports a route handler for BasicAuth.
 */
module.exports = passport.authenticate(['basic'], {session:false}); 