/**
 * Module exports a JWT authentication route handler.
 * 
 * @module controllers/jwt
 * @see strategies/jwt
 */

/**Import Anonymous Strategy */
const anon = require("passport-anonymous").Strategy;

/**Create new instance of anonymous strategy */
const anonAuth = new anon();

/**Import a new instance of JWT Strategy */
const jwtAuth = require('../strategies/jwt');

const passport = require('koa-passport');

passport.use(jwtAuth);
passport.use(anonAuth)

/** Routes which require authentication use only JWT*/
exports.reqLogin = passport.authenticate(['jwt'], {session:false});

/**If JWT fails, the user is authenticated as an "anonymous" user. */
exports.optionalLogin = passport.authenticate(['jwt',"anonymous"], {session:false});