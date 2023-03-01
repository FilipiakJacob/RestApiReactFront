/**
* A module to handle the book endpoint of the API. 
* @module routes/book
* @author JF 
* @see @file 
*/

/**Create an instance of koa-router */
const Router = require("koa-router")

/**Create an instance of koa-bodyparser for parsing request body */
const bodyParser = require("koa-bodyparser");

/**Import book model for database access */
const model = require("../models/book")

/** Set a path for the book endpoint */
const router = Router({prefix: '/api/v1/book'});

/**Import JWT authentication strategy handler */
const {reqLogin, optionalLogin} = require("../controllers/jwt");

const can = require("../permissions/book");

/**Import validator */
const {validateBookAdd,validateBookUpd, validateBookApprove} = require("../controllers/validation")

/** Define which functions and middleware will be triggered by each request to the endpoint */

/**Get routes are available for unregistered users (JWT authentication is optional) */
router.get('/',optionalLogin, getAll);
router.get('/:id([0-9]{1,})',optionalLogin, getById);

router.post('/',reqLogin, bodyParser(), validateBookAdd, addBook);
router.put('/:id([0-9]{1,})',reqLogin, bodyParser(), validateBookUpd, updateBook); 
router.del('/:id([0-9]{1,})',reqLogin, deleteBook);

/** Routes for admin to see and approve book submissions. */
router.get('/unapproved', reqLogin, getUnapproved);
router.patch('/unapproved([0-9]{1,})', reqLogin, validateBookApprove, approveBook);

/**
 * Endpoint responsible for getting a single user resource by user ID.
 * @param ctx Identifier to the context of the HTTP request.
 * @param next Add the next middleware on top of callstack, then remove it once it finishes. 
 */
async function getById(ctx, next)
{
    // Get the ID from the route parameters.
    let id = ctx.params.id;
    let book = await model.getById(id);
    if (book.length)
    {
        if(!ctx.state.user)
        {
            ctx.state.user = {"role":"unregistered"};
        }
        const permission = can.read(ctx.state.user, book[0]);
        if (!permission.granted) 
        {
            ctx.status = 403;
        }
        else
        {
            ctx.status = 200;
            ctx.body = book[0];
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
    }
    else
    {
        const page = ctx.query.page;
        const limit = ctx.query.limit;
        const order = ctx.query.order;
        let books = await model.getAll(page, limit, order);
        if (books.length) 
        {
            ctx.status = 200;
            ctx.body = books;
        }
        else
        {
            ctx.status = 404;
        }
    }
}

async function addBook(ctx, next)
{
    const permission = can.upload(ctx.state.user, book);
    if (!permission.granted) 
    {
        ctx.status = 403;
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
            ctx.status = 400;
        }
    }
}

async function updateBook(ctx, next)
{
    let id = ctx.params.id;
    let body = ctx.request.body;
    const book = await model.getById(id);
    if(book)
    {
        const permission = can.update(ctx.state.user,book[0]);
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
                ctx.status = 400;
            }
        }
    }
    else
    {
        ctx.status = 404;
    }
}

async function deleteBook(ctx, next)
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
        let books = await model.getUnapproved();
        if (books.length)
        {
            ctx.status = 200;
            ctx.body = books;
        }
        else
        {
            ctx.status = 404;
        }
    }
}

async function approveBook(ctx, next)
{
    const permission = can.approveBook(ctx.state.user);
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