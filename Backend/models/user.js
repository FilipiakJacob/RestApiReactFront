/**
 * This module encapsulates all interactions between the "user" API endpoint 
 * and the MySQL database.
 * 
 * @module modules/user
 * @author JF
 */


const db = require('../helpers/database');

const bcrypt = require('bcrypt');


/**
 * Function queries the database for data pertaining to a single user
 * 
 * @param {int} id The ID of the user whose data was requested
 * @returns {object} MySQL results object
 * @throws {DatabaseException} Custom exception for DB query failures
 */
exports.getById = async function getById (id) { 
    let query = "SELECT * FROM users WHERE ID = ?";

    let values = [id]; 
    let data = await db.run_query(query, values); 
    return data; 
} 

/**
 * List all users in the database.
 * 
 * @param {int} [page=1] The page of results to return
 * @param {int} [limit=5] The number of results per page
 * @param {string} [order="id"] The parameter by which to sort the results
 * @returns {object} MySQL results object
 * @throws {DatabaseException} Custom exception for DB query failures
 */

exports.getAll = async function getAll (page=1, limit=5, order="id") { 
    let offset = page*limit-limit; //If page is 4 and limit is 5, it will show 15-20
    let values = [order, Number(limit), offset];
    let query = "SELECT * FROM users ORDER BY ? LIMIT ? OFFSET ?"; 
    let data = await db.run_query(query, values); 
    return data; 
} 

/**
 * Add a new user to the database.
 * 
 * @param {object} user Object containing information about the user
 * @param {string} user.username The username of the user
 * @param {string} user.password The password of the user
 * @param {string} user.email The email address of the user
 * @returns {object} MySQL results object
 * @throws {DatabaseException} Custom exception for DB query failures
 */
exports.add = async function add (user) { 
    user.password = await bcrypt.hash(user.password,10);
    let query = "INSERT INTO users SET ?";
    let data = await db.run_query(query, user);
    return data
}


/**
 * Get the total number of items in the database.
 * @returns Count of users in the database.
 */
 exports.total = async function total(){
    
    var query = "SELECT COUNT(*) AS total FROM users"
    let data = await db.run_query(query);
    return data[0];
}

/**
 * Update a new user to the database.
 * 
 * @param {object} user Object containing information about the user
 * @param {string} user.username The username of the user
 * @param {string} user.password The password of the user
 * @param {string} user.email The email address of the user
 * @returns {object} MySQL results object
 * @throws {DatabaseException} Custom exception for DB query failures
 */
exports.update = async function update (id, user) {
    user.password = await bcrypt.hash(user.password,10);
    let query = "UPDATE users SET ? WHERE id = ?";
    let data = await db.run_query(query, [user,id]);
    return data; 
}

/**
 * Delete a user from the database.
 * 
 * @param {int} id The ID number of the user to delete
 * @returns {object} MySQL results object
 * @throws {DatabaseException} Custom exception for DB query failures
 */
exports.delete = async function deleteUser(id)
{
    let query = "DELETE FROM users WHERE id=?";
    let data = await db.run_query(query,id)
    
    return data;

}

/**
 * Function queries the database in search of a user with a given username.
 * This function should NOT be made and endpoint. 
 * 
 * @param {string} username The username of by which the database is filtered.
 * @returns {object} MySQL results object containing data about the user.
 * @throws {DatabaseException} Custom exception for DB query failures
 */
exports.findByUsername = async function getByUsername(username) 
{
    const query = "SELECT * FROM users WHERE username = ?;";
    const user = await db.run_query(query, username);
    return user;
}