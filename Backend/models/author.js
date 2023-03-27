/**
 * This module encapsulates all interactions between the "author" API endpoint 
 * and the MySQL database.
 * 
 * @module modules/author
 * @author JF
 */

const db = require('../helpers/database'); 


/**
 * Function queries the database for data pertaining to a single author.
 * 
 * @param {int} id The ID of the book author whose data was requested
 * @returns {object} MySQL results object.
 * @throws {DatabaseException} Custom exception for DB query failures
 */
exports.getById = async function getById (id) {
    let query = "SELECT * FROM authors WHERE id = ?";

    let values = [id]; 
    let data = await db.run_query(query, values);

    return data; 
} 

/**
 * List all authors in the database.
 * 
 * @param {int} [page=0] The page of results to return.
 * @param {int} [limit=5] The number of results per page.
 * @param {string} [order="id"] The parameter by which to sort the results.
 * @param {string} [orderAD="descending"] Whether order should be ascending or descending.
 * @returns {object} MySQL results object
 * @throws {DatabaseException} Custom exception for DB query failures
 */
//TODO: Ascending/descending sort
exports.getAll = async function getAll (page=0, limit=5, order="id", orderAD="descending") { 
    let offset = Math.max(0,page*limit-limit); //If page is 4 and limit is 5, it will show 15-20
    let values = [order, Number(limit), offset];
    let query = "SELECT `id`,`name` FROM authors WHERE approved = 1 ORDER BY ? LIMIT ? OFFSET ?"; 
    let data = await db.run_query(query, values);
    return data; 
}

/**
 * Add a new author to the database.
 * 
 * @param {object} author Object containing information about the author.
 * @param {string} author.name The name of the author
 * @returns {object} MySQL results object
 * @throws {DatabaseException} Custom exception for DB query failures
 */
exports.add = async function add (author) { 
    let query = "INSERT INTO authors SET ?";
    let data = await db.run_query(query, author); 
    return data; 
}

/**
 * Update a single author in the database.
 * 
 * @param {int} id The ID of the author whose data should be updated.
 * @param {object} author Object containing information about the author.
 * @param {string} author.name The name of the author
 * @returns {object} MySQL results object
 * @throws {DatabaseException} Custom exception for DB query failures
 */
exports.update = async function update(id,author)
{
    let values = [author,id];
    let query = "UPDATE authors SET ? WHERE id=?";
    let data = await db.run_query(query, values);
    return data;
}

/**
 * Delete a single author from the database.
 * 
 * @param {int} id The ID number of the author whose data is to be deleted from the database.
 * @returns {object} MySQL results object
 * @throws {DatabaseException} Custom exception for DB query failures
 */
exports.delete = async function deleteAuthor(id)
{
    let query = "DELETE FROM authors WHERE id=?";
    let data = await db.run_query(query,id)
    
    return data;

}

/**
 * List all unapproved authors in the database.
 * 
 * @param {int} [page=0] The page of results to return.
 * @param {int} [limit=5] The number of results per page.
 * @param {string} [order="id"] The parameter by which to sort the results.
 * @param {string} [orderAD="descending"] Whether order should be ascending or descending.
 * @returns {object} MySQL results object
 * @throws {DatabaseException} Custom exception for DB query failures
 */
//TODO: Ascending/descending sort


exports.getUnapproved = async function getUnapproved (page=0, limit=5, order="id", orderAD="descending") { 
    let offset = Math.max(0,page*limit-limit); //If page is 4 and limit is 5, it will show 15-20
    let values = [order, Number(limit), offset];
    let query = "SELECT `id`,`name` FROM authors WHERE approved = 0 ORDER BY ? LIMIT ? OFFSET ?"; 
    let data = await db.run_query(query, values);
    return data; 
}


/**
 * Takes ID of author in DB and an author object containing approval. If the approval is equal
 * to "approve", the author is approved. If it is equal to "reject", the author is deleted from the database.
 * @param {number} id The ID number of the author in the database.
 * @param {object} author The author object.
 * @param {string} author.approved The approval option. Either "approve" or "reject"
 */
exports.approveAuthor = async function approveAuthor (id, author)
{
    if(author.approved == "approve")
    {
        var query = "UPDATE authors SET approved = 1 WHERE id=?";
    }
    if(author.approved == "reject")
    {
        var query ="DELETE FROM authors WHERE id=?";
    }
    let data = await db.run_query(query, id);
    return data;
}