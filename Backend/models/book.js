/**
 * This module encapsulates all interactions between the "book" API endpoint 
 * and the MySQL database.
 * 
 * @module modules/book
 * @author JF
 */



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
 * List all approved books in the database.
 * 
 * @param {int} [page=1] The page of results to return.
 * @param {int} [limit=5] The number of results per page.
 * @param {string} [order="id"] The parameter by which to sort the results.
 * @returns {object} MySQL results object
 * @throws {DatabaseException} Custom exception for DB query failures
 */
exports.getAll = async function getAll (page=1, limit=5, order="id") { 
    let offset = page*limit-limit; //If page is 4 and limit is 5, it will show 15-20
    let values = [order, Number(limit), offset];
    let query = "SELECT `id`, `name`, `authorId`, `date`, `isbn`,`description`, `cover` FROM books WHERE `approved`=1 ORDER BY ? LIMIT ? OFFSET ?"; 
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
    let query = "INSERT INTO books SET ?";
    let data = await db.run_query(query, book); 
    return data; 
}

/**
 * Get the total number of items in the database.
 * @param {string} approved Either "approved" or "unapproved"
 * @returns Either the count of approved or unapproved books in the database.
 */
 exports.total = async function total(approved){
    if (approved=="approved"){
        var query = "SELECT COUNT(*) AS total FROM books WHERE approved = 1"
    }
    if(approved=="unapproved"){
        var query = "SELECT COUNT(*) AS total FROM books WHERE approved = 0"
    }
    let data = await db.run_query(query);
    return data[0];
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
    let values = [book, id];
    let query = "UPDATE books SET ? WHERE id=?";
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
exports.delete = async function deleteBook(id)
{
    let query = "DELETE FROM books WHERE id=?";
    let data = await db.run_query(query,id)
    
    return data;

}

/**
 * List all approved books in the database.
 * 
 * @param {int} [page=1] The page of results to return.
 * @param {int} [limit=5] The number of results per page.
 * @param {string} [order="id"] The parameter by which to sort the results.
 * @returns {object} MySQL results object
 * @throws {DatabaseException} Custom exception for DB query failures
 */
exports.getUnapproved = async function getUnapproved (page=1, limit=5, order="id") { 
    let offset = page*limit-limit; //If page is 4 and limit is 5, it will show 15-20
    let values = [order, Number(limit), offset];
    let query = "SELECT `id`, `name`, `authorId`, `date`, `isbn`,`description`, `cover` FROM books WHERE `approved`=0 ORDER BY ? LIMIT ? OFFSET ?"; 
    let data = await db.run_query(query, values);
    return data; 
}

/**
 * Takes ID of book in DB and an book object containing approval. If the approval is equal
 * to "approve", the book is approved. If it is equal to "reject", the book is deleted from the database.
 * @param {number} id The ID number of the book in the database.
 * @param {object} book The book object.
 * @param {string} book.approved The approval option. Either "approve" or "reject"
 */
 exports.approveBook = async function approveBook (id, book)
 {
     if(book.approved == "approve")
     {
         var query = "UPDATE books SET approved = 1 WHERE id=?";
     }
     if(book.approved == "reject")
     {
         var query = "DELETE FROM books WHERE id=?";
     }
     let data = await db.run_query(query, id);
     return data;
 }
