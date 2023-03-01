const AccessControl = require("role-acl");

const ac = new AccessControl();

/**
 * Permission for all users. They are only able to read approved authors.
 */
 ac.grant("unregistered").condition({Fn:"EQUALS",args:{"approved":1}}).execute("read")
    .on("author");

ac.grant("unregistered").execute("readApproved")
    .on("authors");


/**
 * Permissions for "registered" users.
 */

/**Registered can do anything that unregistered can and more. */
ac.grant("registered").extend("unregistered");

ac.grant("registered").execute("upload")
    .on("author");
ac.grant("registered").execute("update")
    .on("author");

/**
 * Permissions for "admin" users.
 */
/**Admin can do anything that registered can and more. */
ac.grant("admin").extend("registered");

ac.grant("admin").execute("delete")
    .on("author");

/**Admin can read unapproved book authors from the database.*/
ac.grant("admin").condition({Fn:"EQUALS",args:{"approved":0}}).execute("read")
    .on("author");

/**Admin can execute readUnapproved which returns all unapproved authors. */
ac.grant("admin").execute("readUnapproved").on("authors");

/**Admin can change approval status of authors in the database */
ac.grant("admin").execute("approve")
    .on("author");

exports.read = (requester, author) =>
    ac.can(requester.role).context({approved:author.approved}).execute("read").sync().on("author");

exports.readAll = (requester) =>
    ac.can(requester.role).execute("readApproved").sync().on("authors");

exports.upload = (requester) =>
    ac.can(requester.role).execute("upload").sync().on("author");

exports.update = (requester) =>  
    ac.can(requester.role).execute("update").sync().on("author");

exports.delete = (requester) =>    
    ac.can(requester.role).execute("delete").sync().on("author");

exports.readUnapproved = (requester) =>
    ac.can(requester.role).execute("readUnapproved").sync().on("authors");

exports.approveAuthor = (requester) =>
    ac.can(requester.role).execute("approve").sync().on("author");