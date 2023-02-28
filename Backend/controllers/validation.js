/**

* A module to run JSON Schema based validation on request/response data.

* @module controllers/validation

* @author JF

* @see schemas/* for JSON Schema definition files

*/


const {Validator, ValidationError} = require('jsonschema');

const v = new Validator();

const {author, authorAdd, authorUpd } = require('../schemas/author.json').definitions;
const {book, bookAdd, bookUpd } = require('../schemas/book.json').definitions;
const {review, reviewAdd, reviewUpd } = require('../schemas/review.json').definitions;
const {user, userAdd, userUpd } = require('../schemas/user.json').definitions;

/**
    * Wrapper that returns a Koa middleware validator for a given schema.
    * @param {object} schema - The JSON schema definition of the resource
    * @param {string} resource The name of the resource, for example "author"
    * @returns {function} - A Koa middleware handler taking (ctx, next) params
    */
const makeKoaValidator = (schema, resource) => {
    /**
        * Koa middleware handler function to do validation
        * @param {object} ctx - The Koa request/response context object
        * @param {function} next - The Koa next callback
        * @throws {ValidationError} a jsonschema library exception
        */
    return async (ctx, next) => {

        const validationOptions = {
            throwError: true,
            allowUnknownAttributes: false,
            propertyName: resource
        };

        const body = ctx.request.body;

        try {
            v.validate(body, schema, validationOptions);
            await next();
        } catch (error) {
            if (error instanceof ValidationError) {
                ctx.body = error;
                ctx.status = 400;
            } else {
                throw error;
            }
        }
    }
}

/** Validate data against author schema */
exports.validateAuthor = makeKoaValidator(author, 'author');
exports.validateAuthorAdd = makeKoaValidator(authorAdd, 'authorAdd');
exports.validateAuthorUpd= makeKoaValidator(authorUpd, 'authorUpd');
/** Validate data against book schema */
exports.validateBook = makeKoaValidator(book, 'book');
exports.validateBookAdd = makeKoaValidator(bookAdd, 'bookAdd');
exports.validateBookUpd= makeKoaValidator(bookUpd, 'bookUpd');
/** Validate data against review schema */
exports.validateReview = makeKoaValidator(review, 'review');
exports.validateReviewAdd = makeKoaValidator(reviewAdd, 'reviewAdd');
exports.validateReviewUpd= makeKoaValidator(reviewUpd, 'reviewUpd');
/** Validate data against user schema for creating new users */
exports.validateUser = makeKoaValidator(user, 'user');
exports.validateUserAdd = makeKoaValidator(userAdd, 'userAdd');
exports.validateUserUpd= makeKoaValidator(userUpd, 'userUpd');
