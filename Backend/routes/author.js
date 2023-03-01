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
router.get('/',optionalLogin, getAll);
router.post('/',reqLogin, bodyParser(), validateAuthorAdd, addAuthor);
router.get('/:id([0-9]{1,})',optionalLogin, getById);
//TODO: Take ID from request BODY instead.
router.put('/:id([0-9]{1,})',reqLogin, validateAuthorUpd, bodyParser(),updateAuthor); 
router.del('/:id([0-9]{1,})',reqLogin, deleteAuthor);

/** Routes for the admin to see and approve book author submissions. */
router.get('/unapproved', reqLogin, getUnapproved);
router.patch('/unapproved([0-9]{1,})', reqLogin, validateAuthorApprove, approveAuthor);


//TODO: Comment other endpoints.
/**
 * Endpoint responsible for getting a single user resource by user ID.
 * @param {object} ctx Identifier to the context of the HTTP request.
 * @param {function} next Add the next middleware on top of callstack, then remove it once it finishes. 
 */
async function getById(ctx, next)
{
    //If the user did not provide a JWT, they are unregistered.
    if(!ctx.state.user)
    {
        ctx.state.user = {"role":"unregistered"};
    }
    let id = ctx.params.id;
    // If it exists then return the author as JSON.
    let author = await model.getById(id);
    const permission = can.read(ctx.state.user,author[0]);
    if (!permission.granted) {
        ctx.status = 403;
    }
    else
    {
        if (author.length)
        {
            ctx.body = author[0];
        }
        else
        {
            ctx.status = 404;
        }
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
    const permission = can.readAll(ctx.state.user);
    //Check permissions.
    if (!permission.granted) 
    {
        ctx.status = 403;
    }
    else
    {
        let authors = await model.getAll(page, limit, order);
        //Check user permissions.
        if (authors.length) 
        {
            ctx.body = authors;
        }
        else
        {
            ctx.status = 404;
        }
    }
}

async function addAuthor(ctx, next)
{
    // The body parser gives us access to the request body on cnx.request.body. 
    // Use this to extract the title and fullText we were sent.
    const body = ctx.request.body;
    let result = await model.add(body,ctx.state.user.ID); 
    if (result) 
    {
        ctx.status = 201;
        ctx.body = {ID: result.insertId}
    }
    else
    {
        ctx.status = 404;
    }
}

async function updateAuthor(ctx, next)
{
    let id = ctx.params.id;
    let body = ctx.request.body;
    const article = await model.getById(id);
    const permission = can.update(ctx.state.user,article[0]);
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
        else
        {
            ctx.status = 404;
        }
    }
}

async function deleteAuthor(ctx, next)
{
    const permission = can.delete(ctx.state.user);
    if (!permission.granted) {
        ctx.status = 403;
    }
    else
    {
        let id = ctx.params.id;
        let result = await model.delete(id);
        if (result) 
        {
            ctx.status = 200;
        }
        else
        {
            ctx.status = 404;
        }
    }
}

async function getUnapproved(ctx, next)
{
    const permission = can.readUnapproved(ctx.state.user);
    if (!permission.granted) 
    {
        ctx.status = 403;
    }
    else
    {
        let authors = await model.getUnapproved();
        if (authors.length)
        {
            ctx.status = 201;
            ctx.body = authors;
        }
        else
        {
            ctx.status = 404;
        }
    }
}

async function approveAuthor(ctx, next)
{
    const permission = can.approveAuthor(ctx.state.user);
    if (!permission.granted)
    {
        ctx.status = 403;
    }
    else
    {
        let id = ctx.params.id;
        let body = ctx.request.body;
        let result = await model.approveAuthor(id, body);
        if (result)
        {
            ctx.status = 204;
        }
        else
        {
            ctx.status = 404;
        }
    }
}
module.exports = router;