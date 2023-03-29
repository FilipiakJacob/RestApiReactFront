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
const {reqLogin, optionalLogin} = require("../controllers/jwt");

/** Set a path for the user endpoint */
const router = Router({prefix: "/api/v1/user"});

/**Import validator */
const { validateUserAdd, validateUserUpd } = require("../controllers/validation");

/**Import permissions */
const can = require("../permissions/user")

router.get("/",reqLogin, getAll);
//TODO: Limit duplicates
router.post("/",optionalLogin, bodyParser(), validateUserAdd, createUser);
router.get("/:id([0-9]{1,})",reqLogin, getById);
router.put("/:id([0-9]{1,})",reqLogin, bodyParser(), validateUserUpd, updateUser); 
router.del("/:id([0-9]{1,})",reqLogin, deleteUser);

async function getById(ctx)
{
    // Get the ID from the route parameters.
    const id = ctx.params.id;
    const user = await model.getById(id);
    if (user.length)
    {
        if(!ctx.state.user)
        {
            ctx.state.user = {"role":"unregistered"};
        }
        const permission = can.read(ctx.state.user, user[0]);
        if (!permission.granted) 
        {
            ctx.status = 403;
            ctx.body = {"message":"Insufficient access level"}
        }
        else
        {
            //Filter out data that is not allowed for permission level.
            user[0] = permission.filter(user[0])
            ctx.status = 200;
            ctx.body = user[0];
        }
    }
    else
    {
        ctx.status = 404;
    }
}

async function getAll(ctx, next)
{
    if(!ctx.state.user)
    {
        ctx.state.user = {"role":"unregistered"};
    }
    const permission = can.readAll(ctx.state.user);
    if (!permission.granted) 
    {
        ctx.status = 403;
        ctx.body = {"message":"Only admins can view all records."}
    }
    else
    {
        const page = ctx.query.page;
        const limit = ctx.query.limit;
        const order = ctx.query.order;
        let users = await model.getAll(page, limit, order);
        if (users.length) 
        {
            //Filter out data from each record
            users.forEach((user,index) => {
                users[index] = permission.filter(user);
            });
            ctx.status = 200;
            ctx.body = users;
        }
        else
        {
            ctx.status = 404;
            ctx.body = {"message":"No user records found."}
        }
    }
}


async function createUser(ctx)
{
    const body = ctx.request.body;
    let result = await model.add(body); 
    if (result) 
    {
        ctx.status = 201;
        ctx.body = {ID: result.insertId}
    }
    else
    {
        ctx.status = 500;
        ctx.body = {"message":"Something went wrong on the server side. If this keeps happening, contact the admin."}
    }
}

async function updateUser(ctx)
{
    let id = ctx.params.id;
    let body = ctx.request.body;
    const user = await model.getById(id);
    if (user)
    { 
        const permission = can.update(ctx.state.user,user[0]);
        if (!permission.granted) 
        {
            ctx.status = 403;
            ctx.body = {"message":"Users can only modify their own account."}
        }
        else
        {
            let result = await model.update(id,body)
            if (result) 
            {
                ctx.status = 204;
            }
            else
            {
                ctx.status = 500;
                ctx.body = {"message":"Something went wrong on the server side. If this keeps happening, contact the admin."}
            }
        }
    }
    else
    {
        ctx.status = 404;
        ctx.body = {"message":"No user records found."}
    }
}

async function deleteUser(ctx)
{
    const id = ctx.params.id;
    const user = await model.getById(id);
    if (user.length) 
    {
        const permission = can.delete(ctx.state.user, user[0]);
        if (!permission.granted) {
            ctx.status = 403;
            ctx.body = {"message":"Users can only delete their own account."}
        }
        else
        {
            const result = await model.delete(id)
            if (result.affectedRows == 1)
            {
                ctx.status = 204;
            }
            else
            {
                ctx.status = 500;
                ctx.body = {"message":"Something went wrong on the server side. If this keeps happening, contact the admin."}
            }
        }
    }
    else
    {
        ctx.status = 404;
        ctx.body = {"message":"No user records found."}
    }
}

module.exports = router;