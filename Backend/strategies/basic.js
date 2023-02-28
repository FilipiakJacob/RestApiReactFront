/**
 * This module encapsulates the BasicAuth authorization strategy.
 * 
 * @module strategies/basic
 * @see controllers/basic
 */


const BasicStrategy = require('passport-http').BasicStrategy;

const user = require('../models/user');
const bcrypt = require('bcrypt')


/**
 * Function takes a user object from the database and a password from the request,
 * then verifies if the two passwords match. 
 * 
 * @async
 * @param {object} user The user object contains data from the user table.
 * @param {string} password The password to compare against the password in the database.
 * @returns A bcrypt promise to be either resolved with the comparison result salt, or rejected with an error.
 */
const verifyPassword = async function (user, password) 
{
    //Compares provided password with the password from database
    comparison = bcrypt.compare(password, user.password);
    return comparison;
}


/**
 * Function which takes in a username and password, then evaluates if they match a user in the database.
 * 
 * @param {string} username The username of the user.
 * @param {string} password The password of the user.
 * @param {callback} done Callback to be returned by the function.
 * @returns "done" callback, with either error as first argument, the user data, or false
 */
const checkUserAndPass = async (username, password, done) => {
    let result;
    try 
    {
        result = await user.findByUsername(username);
    } 
    catch (error) 
    {
        console.error(`Error during authentication for user ${username}`);
        return done(error);
    }
    if (result.length) 
    {
        const user = result[0];

        if (await verifyPassword(user, password)) 
        {
            console.log(`Successfully authenticated user ${username}`);
            return done(null, user);
        }
        else 
        {
            console.log(`Password incorrect for user ${username}`);
        }
    } 
    else 
    {
        console.log(`No user found with username ${username}`);
    }
    return done(null, false); // username or password were incorrect
}

const strategy = new BasicStrategy(checkUserAndPass);

module.exports = strategy;