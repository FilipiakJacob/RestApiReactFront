/**
* A module to handle the user endpoint of the API. 
* @module routes/user
* @author JF 
* @see @file 
*/

/**Create an instance of koa-router */
const Router = require("koa-router")

/**Create an instance of koa-bodyparser for parsing request body */
const bodyParser = require("koa-bodyparser");

/**Import user model for database access */
const model = require("../models/user")

/**Import JWT authentication strategy handler */
const jwtAuth = require('../controllers/jwt');

/** Set a path for the user endpoint */
const router = Router({prefix: '/api/v1/user'});

router.get('/',jwtAuth, getAll);
router.post('/', bodyParser(), createUser);
router.get('/:id([0-9]{1,})',jwtAuth, getById);
router.put('/:id([0-9]{1,})',jwtAuth, bodyParser(), updateUser); 
router.del('/:id([0-9]{1,})',jwtAuth, deleteUser);

async function getAll(ctx, next)
{
    const permission= {
        granted : true
    }
    //const permission = can.readAll(ctx.state.user); //ctx.state.user is set by jwt strategy
    if (!permission.granted) {
        ctx.status = 403;
    } else {
        const users = await model.getAll(); 
        // Use the response body to send the articles as JSON. 
        if (users.length) {
            ctx.body = users;
        }
    }
}

async function getById(ctx)
{
    const permission= {
        granted : true
    }
    // Get the ID from the route parameters.
    let id = ctx.params.id;
    // Check if the user has the same ID as the user resource they're requesting.
    //const permission = can.read(ctx.state.user,{"ID":Number(id)})
    if (!permission.granted) {
        ctx.status = 403;
    }
    else
    {
        let userInDb = await model.getById(id);
        // If it exists then return the user as JSON.
        if (userInDb.length)
        {
            ctx.body = userInDb[0];
        }
    }
}

async function createUser(ctx)
{
    // The body parser gives us access to the request body on cnx.request.body. 
    // Use this to extract the title and fullText we were sent.
    const body = ctx.request.body;
    let result = await model.add(body); 
    if (result) 
    {
        ctx.status = 201;
        ctx.body = {ID: result.insertId}

    }

}

async function updateUser(ctx)
{
    let id = ctx.params.id;
    let body = ctx.request.body;
    // Check if the user has the same ID as the user resource they're requesting.
    const permission = can.update(ctx.state.user,{"ID":Number(id)})
    if (!permission.granted) {
        ctx.status = 403;
    }
    else
    {
        let result = await model.update(id,body)
        if (result) 
        {
            ctx.status = 204;
        }
    }
}

async function deleteUser(ctx)
{
    let id = ctx.params.id;
    // Check if the user has the same ID as the user resource they're requesting.
    const permission = can.delete(ctx.state.user,{"ID":Number(id)})
    if (!permission.granted) {
        ctx.status = 403;
    }
    else
    {
        let result = await model.delete(id);
        if (result) 
        {
            ctx.status = 200;
        }
    }
}

module.exports = router;