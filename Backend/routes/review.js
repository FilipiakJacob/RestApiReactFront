/**
* A module to handle the review endpoint of the API. 
* @module routes/review
* @author JF 
* @see @file 
*/

/**Create an instance of koa-router */
const Router = require("koa-router")

/**Create an instance of koa-bodyparser for parsing request body */
const bodyParser = require("koa-bodyparser");

/**Import review model for database access */
const model = require("./models/review")

/** Set a path for the review endpoint */
const router = Router({prefix: '/api/v1/review'});

/** Define which functions and middleware will be triggered by each request to the endpoint */
router.get('/', getAll);
router.post('/',bodyParser(),addreview);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})',bodyParser(),updatereview); 
router.del('/:id([0-9]{1,})', deletereview);

router.get('/', getAll);
router.post('/',bodyParser(),addreview);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})',bodyParser(),updatereview); 
router.del('/:id([0-9]{1,})', deletereview);

/**
 * Endpoint responsible for getting a single user resource by user ID.
 * @param ctx Identifier to the context of the HTTP request.
 * @param next Add the next middleware on top of callstack, then remove it once it finishes. 
 */
async function getById(ctx, next)
{
    // Get the ID from the route parameters.
    let id = ctx.params.id;
    // If it exists then return the review as JSON.
    let review = await model.getById(id);
    const permission = can.read(review[0]);
    if (!permission.granted) {
        ctx.status = 403;
    }
    else
    {
        if (review.length)
        {
            ctx.body = review[0];
            await reviewViews.add(id);
        }
    }
}

async function getAll(ctx, next)
{
    const page = ctx.query.page;
    const limit = ctx.query.limit;
    const order = ctx.query.order;
    let reviews = await model.getAll(page, limit, order);
    // Use the response body to send the reviews as JSON. 
    if (review.length) {
        ctx.body = reviews;
    }
}

async function addreview(ctx, next)
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

async function updatereview(ctx, next)
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

async function deletereview(ctx, next)
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