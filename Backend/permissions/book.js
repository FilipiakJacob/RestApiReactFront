const AccessControl = require("role-acl");

const ac = new AccessControl();

/**
 * Permission for all users. They are only able to read approved books.
 */
 ac.grant("unregistered").condition({Fn:"EQUALS",args:{"approved":1}}).execute("read")
    .on("book");

ac.grant("unregistered").execute("readApproved")
    .on("books");


/**
 * Permissions for "registered" users.
 */

/**Registered can do anything that unregistered can and more. */
ac.grant("registered").extend("unregistered");

ac.grant("registered").execute("upload")
    .on("book");
ac.grant("registered").execute("update")
    .on("book");

/**
 * Permissions for "admin" users.
 */
/**Admin can do anything that registered can and more. */
ac.grant("admin").extend("registered");

ac.grant("admin").execute("delete")
    .on("book");

/**Admin can read unapproved book books from the database.*/
ac.grant("admin").condition({Fn:"EQUALS",args:{"approved":0}}).execute("read")
    .on("book");

/**Admin can execute readUnapproved which returns all unapproved books. */
ac.grant("admin").execute("readUnapproved").on("books");

/**Admin can change approval status of books in the database */
ac.grant("admin").execute("approve")
    .on("book");

exports.read = (requester, book) =>
    ac.can(requester.role).context({approved:book.approved}).execute("read").sync().on("book");

exports.readAll = (requester) =>
    ac.can(requester.role).execute("readApproved").sync().on("books")

exports.upload = (requester) =>
    ac.can(requester.role).execute("upload").sync().on("book");

exports.update = (requester) =>  
    ac.can(requester.role).execute("update").sync().on("book");

exports.delete = (requester) =>    
    ac.can(requester.role).execute("delete").sync().on("book");

exports.readUnapproved = (requester) =>
    ac.can(requester.role).execute("readUnapproved").sync().on("books");

exports.approveBook = (requester) =>
    ac.can(requester.role).execute("approve").sync().on("book");