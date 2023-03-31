/**
 * The module"s purpose is creating a login endpoint. The user can send a
 * GET request to this endpoint and provide the username and password through
 * BasicAuth. If the data is correct, they will be issued a JSON Web Token for access
 * to other endpoints. 
 * @module routes/login
 * @author JF
 */

const Router = require("koa-router")
const basicAuth = require("../controllers/basic");
const jsonwebtoken = require("jsonwebtoken")
const router = Router({prefix: "/api/v1/login"});
const jwtConfig = require("../config").JWTConfig



router.get("/",basicAuth,logIn);


/**
 * Function takes the CTX object provided by the BasicAuth middleware,
 * which contains the data of an authenticated user. It then issues and
 * sends back a JWT and expiration time in the response body. 
 * 
 * @param {object} ctx Identifier to the context of the HTTP request.
 * @param {object} next Add the next middleware on top of callstack, then remove it once it finishes.
 */
async function logIn(ctx, next)
{
    let user = ctx.state.user;
    const jwt = issueJWT(user);
    ctx.status = 200;
    ctx.body = {
        token:jwt.token,
        expiresIn:jwt.expires,
        userId: jwt.id
    }
}

/**
 * Function takes the user"s data and produces a JWT for authentication.
 * 
 * @param {object} user Object containing data about the user.
 * @param {string} user.id The ID number of the user 
 * @returns Object containing the signed JWT and expiry date.
 */
//TODO:Set lower expiry date, create refresh.
function issueJWT(user)
{
    const expireIn = "1d";

    const payload ={
        sub: user.id,
        iat: Date.now()
    };
    signedJWT = jsonwebtoken.sign(payload,jwtConfig.secretKey, {expiresIn: expireIn})
    return {
        token: signedJWT,
        expires: expireIn,
        id: user.id
    }
};


module.exports = router;