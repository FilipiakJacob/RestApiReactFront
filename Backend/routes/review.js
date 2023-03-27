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
const model = require("../models/review")

/** Set a path for the review endpoint */
const router = Router({prefix: "/api/v1/review"});

/**Import JWT authentication strategy handler */
const {reqLogin, optionalLogin} = require("../controllers/jwt");

/** Import validator */
const { validateReviewAdd, validateReviewUpd } = require("../controllers/validation");

/** Import permissions. */
const can = require("../permissions/review");



/** Define which functions and middleware will be triggered by each request to the endpoint */
router.get("/",optionalLogin,  getAll);
//TODO: Get review author ID from JWT instead of requiring it in schema.
router.post("/",reqLogin, bodyParser(), validateReviewAdd, addReview);
router.get("/:id([0-9]{1,})",optionalLogin, getById);
router.put("/:id([0-9]{1,})",reqLogin, bodyParser(), validateReviewUpd, updateReview); 
router.del("/:id([0-9]{1,})",reqLogin, deleteReview);


/**
 * Endpoint responsible for getting a single user resource by user ID.
 * @param ctx Identifier to the context of the HTTP request.
 * @param next Add the next middleware on top of callstack, then remove it once it finishes. 
 */
async function getById(ctx, next)
{
    // Get the ID from the route parameters.
    let id = ctx.params.id;
    let review = await model.getById(id);
    if(review.length)
    {
        if(!ctx.state.user)
        {
            ctx.state.user = {"role":"unregistered"};
        }
        const permission = can.read(ctx.state.user, review[0])
        if (!permission.granted) 
        {
            ctx.status = 403;
            ctx.body = "Insufficient access level to access this resource."
        }
        else
        {
            ctx.status = 200;
            ctx.body = review[0];
        }
    }
    else
    {
        ctx.status = 404;
        ctx.body = "There is no such resource in the records."
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
        ctx.body = "Insufficient access level to access this resource."
    }
    else
    {
        const page = ctx.query.page;
        const limit = ctx.query.limit;
        const order = ctx.query.order;
        let reviews = await model.getAll(page, limit, order);
        if (reviews.length) 
        {
            ctx.status = 200;
            ctx.body = reviews;
        }
        else
        {
            ctx.status = 404;
            ctx.body = "There is no such resource in the records."
        }
    }
}

async function addReview(ctx, next)
{
    const permission = can.upload(ctx.state.user);
    if (!permission.granted) 
    {
        ctx.status = 403;
        ctx.body = "Insufficient access level."
    }
    else
    {
        const body = ctx.request.body;
        body.authorId = ctx.state.user.id;
        let result = await model.add(body); 
        if (result) 
        {
            ctx.status = 201;
            ctx.body = {ID: result.insertId}
        }
        else
        {
            ctx.status = 500;
            ctx.body = "Something went wrong on the server side. If this keeps happening, contact the admin."
        }
    }
}

async function updateReview(ctx, next)
{
    let id = ctx.params.id;
    let body = ctx.request.body;
    const review = await model.getById(id);
    if (review)
    { 
        const permission = can.update(ctx.state.user,review[0]);
        if (!permission.granted) 
        {
            ctx.status = 403;
            ctx.body = "Insufficient access level."
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
                ctx.body = "Something went wrong on the server side. If this keeps happening, contact the admin."
            }
        }
    }
    else
    {
        ctx.status = 404;
        ctx.body = "There is no such resource in the records."
    }
}

async function deleteReview(ctx, next)
{
    //TODO: Users can delete their own reviews
    const permission = can.delete(ctx.state.user);
    if (!permission.granted) {
        ctx.status = 403;
        ctx.body = "Insufficient access level to delete this resource."
    }
    else
    {
        let id = ctx.params.id;
        let result = await model.delete(id);
        if (result.length) 
        {
            ctx.status = 204;
        }
        else
        {
            ctx.status = 404;
            ctx.body = "There is no such resource in the records."
        }
    }
}

module.exports = router;