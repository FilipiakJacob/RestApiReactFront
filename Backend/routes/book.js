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

/** Define which functions and middleware will be triggered by each request to the endpoint */
router.get('/', getAll);
router.post('/',bodyParser(),addBook);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})',bodyParser(),updateBook); 
router.del('/:id([0-9]{1,})', deleteBook);


/**
 * Endpoint responsible for getting a single user resource by user ID.
 * @param ctx Identifier to the context of the HTTP request.
 * @param next Add the next middleware on top of callstack, then remove it once it finishes. 
 */
async function getById(ctx, next)
{
    const permission= {
        granted : true
    }
    // Get the ID from the route parameters.
    let id = ctx.params.id;
    // If it exists then return the book as JSON.
    let book = await model.getById(id);
    //const permission = can.read(book[0]);
    if (!permission.granted) {
        ctx.status = 403;
    }
    else
    {
        if (book.length)
        {
            ctx.body = book[0];
        }
    }
}

async function getAll(ctx, next)
{
    const page = ctx.query.page;
    const limit = ctx.query.limit;
    const order = ctx.query.order;
    let books = await model.getAll(page, limit, order);
    // Use the response body to send the books as JSON. 
    if (books.length) {
        ctx.body = books;
    }
}

async function addBook(ctx, next)
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
}

async function updateBook(ctx, next)
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
    }
}

module.exports = router;