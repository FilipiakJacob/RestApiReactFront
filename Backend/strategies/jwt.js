/**
 * Module defines a verification strategy for JSON Web Tokens.
 * 
 * @module strategies/jwt
 * @see controllers/jwt
 */

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const user = require('../models/user');
const jwtConfig = require("../config").JWTConfig

/**
 * Options for the JWT authentication strategy
 */
var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtConfig.secretKey
}

/**
 * Function which verifies the valididty of a given JWT
 * 
 * @param {object} jwt_payload A set of claims contained by the JWT.
 * @param {int} jwt_payload.sub A user ID encoded in the JWT.
 * @param {callback} done Callback to be returned by the function.
 * @returns "done" callback, with either error as first argument, the user data, or false
 */
const verifyToken = async (jwt_payload,done) => {
    let result;
    try 
    {
        result = await user.getById(jwt_payload.sub);
    } 
    catch (error) 
    {
        console.error(`Error during authentication.`);
        return done(error);
    }
    if (result.length) 
    {   
        const user = result[0];
        console.log(`Successfully authenticated user ${user["username"]}`);
        return done(null, user);
    } 
    else 
    {
        console.log(`Token Invalid`);
    }
    return done(null, false); // username or password were incorrect
};


const strategy = new JwtStrategy(opts, verifyToken)

module.exports = strategy;