/**
 * This module encapsulates all interactions between the "review" API endpoint 
 * and the MySQL database.
 * 
 * @module modules/review
 * @author JF
 */


const db = require('../helpers/database'); 

/**
 * Function queries the database for data pertaining to a single review.
 * 
 * @param {int} id The ID of the book review whose data was requested
 * @returns {object} MySQL results object.
 * @throws {DatabaseException} Custom exception for DB query failures
 */
exports.getById = async function getById (id) {
    let query = "SELECT * FROM reviews WHERE ID = ?";

    let values = [id]; 
    let data = await db.run_query(query, values);

    return data; 
} 

/**
 * List all reviews in the database.
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
    let query = "SELECT * FROM reviews ORDER BY ? LIMIT ? OFFSET ?"; 
    let data = await db.run_query(query, values);
    return data; 
}

/**
 * Add a new review to the database.
 * 
 * @param {object} review Object containing information about the review.
 * @param {string} review.comment The comment of the review
 * @param {int} review.rating The rating of the review
 * @param {string} review.authorId The ID of the review's author.
 * @param {string} review.bookId The ID of the book which is being reviewed.
 * @returns {object} MySQL results object
 * @throws {DatabaseException} Custom exception for DB query failures
 */
exports.add = async function add (review, authorId) { 
    review.authorId = authorId
    let query = "INSERT INTO reviews SET ?";
    let data = await db.run_query(query, review); 
    return data; 
}

/**
 * Update a single review in the database.
 * 
 * @param {int} id The ID of the review whose data should be updated.
 * @param {object} review Object containing information about the review.
 * @param {string} review.comment The comment of the review
 * @param {int} review.rating The rating of the review
 * @param {string} review.authorId The ID of the review's author.
 * @returns {object} MySQL results object
 * @throws {DatabaseException} Custom exception for DB query failures
 */
exports.update = async function update(id,review, authorId)
{
    review.authorId = authorId
    let values = [review,id];
    let query = "UPDATE reviews SET ? WHERE id=?";
    let data = await db.run_query(query, values);
    return data;
}

/**
 * Delete a single review from the database.
 * 
 * @param {int} id The ID number of the review whose data is to be deleted from the database.
 * @returns {object} MySQL results object
 * @throws {DatabaseException} Custom exception for DB query failures
 */
exports.delete = async function deleteReview(id)
{
    let query = "DELETE FROM reviews WHERE id=?";
    let data = await db.run_query(query,id)
    console.log(data)
    return data;

}

