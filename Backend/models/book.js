const db = require('../helpers/database'); 

/**
 * Function queries the database for data pertaining to a single book.
 * 
 * @param {int} id The ID of the book book whose data was requested
 * @returns {object} MySQL results object.
 * @throws {DatabaseException} Custom exception for DB query failures
 */
exports.getById = async function getById (id) {
    let query = "SELECT * FROM books WHERE ID = ?";

    let values = [id]; 
    let data = await db.run_query(query, values);

    return data; 
} 

/**
 * List all books in the database.
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
    let query = "SELECT * FROM books ORDER BY ? LIMIT ? OFFSET ?"; 
    let data = await db.run_query(query, values);
    return data; 
}

/**
 * Add a new book to the database.
 * 
 * @param {object} book Object containing information about the book.
 * @param {string} book.name The name of the book.
 * @param {int} book.authorId The ID of the book's author.
 * @param {Date} book.date The date the book was published.
 * @param {string} book.isbn The ISBN code of the book.
 * @param {string} book.description The description of the book.
 * @param {File} book.cover An image of the book.
 * @param {File} book.contents A file containing the contents of the book.
 * @returns {object} MySQL results object
 * @throws {DatabaseException} Custom exception for DB query failures
 */
//TODO: Add sending files with the request.
exports.add = async function add (book) { 
    let query = "INSERT INTO books SET name=?, authorId=?, date=?, isbn=?, description=?, cover=?, contents=?";
    let values = [book.name, book.authorId, book.date, book.isbn, book.description, book.cover, book.contents]
    let data = await db.run_query(query, values); 
    return data; 
}

/**
 * Update a single book in the database.
 * 
 * @param {object} book Object containing information about the book.
 * @param {string} book.name The name of the book.
 * @param {int} book.authorId The ID of the book's author.
 * @param {Date} book.date The date the book was published.
 * @param {string} book.isbn The ISBN code of the book.
 * @param {string} book.description The description of the book.
 * @param {File} book.cover An image of the book.
 * @param {File} book.contents A file containing the contents of the book.
 * @returns {object} MySQL results object
 * @throws {DatabaseException} Custom exception for DB query failures
 */
exports.update = async function update(id,book)
{
    let values = [book.name, book.authorId, book.date, book.isbn, book.description, book.cover, book.contents, id];
    let query = "UPDATE books SET name=?, authorId=?, date=?, isbn=?, description=?, cover=?, contents=? WHERE id=?";
    let data = await db.run_query(query, values);
    return data;
}

/**
 * Delete a single book from the database.
 * 
 * @param {int} id The ID number of the book whose data is to be deleted from the database.
 * @returns {object} MySQL results object
 * @throws {DatabaseException} Custom exception for DB query failures
 */
exports.delete = async function deleteArticle(id)
{
    let query = "DELETE FROM books WHERE id=?";
    let data = await db.run_query(query,[id])
    
    return data;

}
