/**
* A module to handle the author endpoint of the API. 
* @module routes/author
* @author JF 
* @see @file 
*/

/**Create an instance of koa-router */
const Router = require("koa-router")


/**Create an instance of koa-bodyparser for parsing request body */
const bodyParser = require("koa-bodyparser");

/**Import author model for database access */
const model = require("../models/author")

/** Set a path for the author endpoint */
const router = Router({prefix: '/api/v1/author'});

/**Import JWT authentication strategy handler */
const {reqLogin, optionalLogin} = require("../controllers/jwt");

/**Import validator */
const {validateAuthorAdd,validateAuthorUpd, validateAuthorApprove} = require("../controllers/validation")

const can = require("../permissions/author")

/** Define which functions and middleware will be triggered by each request to the endpoint */

/**Get routes are available for unregistered users (JWT authentication is optional) */
router.get('/',optionalLogin, getAll);
router.get('/:id([0-9]{1,})',optionalLogin, getById);

router.post('/',reqLogin, bodyParser(), validateAuthorAdd, addAuthor);

router.put('/:id([0-9]{1,})',reqLogin,bodyParser(), validateAuthorUpd,updateAuthor); 
router.del('/:id([0-9]{1,})',reqLogin, deleteAuthor);

/** Routes for the admin to see and approve author author submissions. */
router.get('/unapproved', reqLogin, getUnapproved);
router.patch('/unapproved/:id([0-9]{1,})', reqLogin,bodyParser(), validateAuthorApprove, approveAuthor);


/**
 * Endpoint responsible for getting a single user resource by user ID.
 * @param {object} ctx Identifier to the context of the HTTP request.
 * @param {function} next Add the next middleware on top of callstack, then remove it once it finishes. 
 */
async function getById(ctx, next)
{
    //If the user did not provide a JWT, they are unregistered.
    let id = ctx.params.id;
    let author = await model.getById(id);
    if (author.length)
    {        
        if(!ctx.state.user)
        {
            ctx.state.user = {"role":"unregistered"};
        }
        const permission = can.read(ctx.state.user,author[0]);
        if (!permission.granted) {
            ctx.status = 403;
            ctx.body = {"message":"Insufficient access level to access this resource."}
        }
        else
        {
            ctx.status = 200;
            ctx.body = author[0];
        }
    }
    else
    {
        ctx.status = 404;
        ctx.body = {"message":"There is no such resource in the database."}
    }
}

async function getAll(ctx, next)
{
    //If the user did not provide a JWT, they are unregistered.
    if(!ctx.state.user)
    {
        ctx.state.user = {"role":"unregistered"};
    }
    const page = ctx.query.page;
    const limit = ctx.query.limit;
    const order = ctx.query.order;
    //Check permissions.
    const permission = can.readAll(ctx.state.user);
    if (!permission.granted) 
    {
        ctx.status = 403;
        ctx.body = {"message": "Insufficient access level"}
    }
    else
    {
        let authors = await model.getAll(page, limit, order);
        let total = await model.total("approved")
        //Check user permissions.
        if (authors.length) 
        {
            ctx.status = 200;
            ctx.body = authors;
            ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
            ctx.set("X-Total-Count", total.total);
        }
        else
        {
            ctx.status = 404;
            ctx.body = {"message":"There is no such resource in the records."}
        }
    }
}

async function addAuthor(ctx, next)
{
    const permission = can.upload(ctx.state.user);
    if (!permission.granted) 
    {
        ctx.status = 403;
        ctx.body = {"message":"Insufficient access level."}
    }
    else
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
}

async function updateAuthor(ctx, next)
{
    let id = ctx.params.id;
    let body = ctx.request.body;
    const author = await model.getById(id);
    if(author)
    {
        const permission = can.update(ctx.state.user,author[0]);
        if (!permission.granted) {
            ctx.status = 403;
            ctx.body = {"message":"Insufficient access level."}
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
        ctx.body = {"message":"There is no such resource in the records."}
    }
}

async function deleteAuthor(ctx, next)
{
    const permission = can.delete(ctx.state.user);
    if (!permission.granted) {
        ctx.status = 403;
        ctx.body = {"message":"Insufficient access level to delete this resource."}
    }
    else
    {
        let id = ctx.params.id;
        let result = await model.delete(id);
        if (result.affectedRows==1) 
        {
            ctx.status = 204;
        }
        else
        {
            ctx.status = 404;
            ctx.body = {"message":"There is no such resource in the records."}
        }
    }
}

async function getUnapproved(ctx, next)
{
    const permission = can.readUnapproved(ctx.state.user);
    if (!permission.granted) 
    {
        ctx.status = 403;
        ctx.body = {"message":"Insufficient access level."}
    }
    else
    {
        const page = ctx.query.page;
        const limit = ctx.query.limit;
        const order = ctx.query.order;
        let authors = await model.getUnapproved(page,limit,order);
        let total = await model.total("unapproved")
        if (authors.length)
        {
            ctx.status = 200;
            ctx.body = authors;
            ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
            ctx.set("X-Total-Count", total.total);
        }
        else
        {
            ctx.status = 404;
            ctx.body = {"message":"There are no unapproved books in the database."}
        }
    }
}

async function approveAuthor(ctx, next)
{
    const permission = can.approveAuthor(ctx.state.user);
    if (!permission.granted)
    {
        ctx.status = 403;
        ctx.body = {"message":"Insufficient access level."}
    }
    else
    {
        let id = ctx.params.id;
        let body = ctx.request.body;
        let result = await model.approveAuthor(id, body);
        if (result.affectedRows == 1)
        {
            ctx.status = 204;
        }
        else
        {
            ctx.status = 404;
            ctx.body = {"message":"There is no such resource in the database."}
        }
    }
}

module.exports = router;