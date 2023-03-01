const AccessControl = require("role-acl");

const ac = new AccessControl();

/**
 * Permission for all users. 
 */
 ac.grant("unregistered").execute("read")
    .on("review");

ac.grant("unregistered").execute("readAll")
    .on("reviews");

/**
 * Permissions for "registered" users.
 */

/**Registered can do anything that unregistered can and more. */
ac.grant("registered").extend("unregistered");

/**Registered users can upload reviews */
ac.grant("registered").execute("upload")
    .on("review");

/**Registered users can update reviews */
ac.grant("registered").condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute("update")
    .on("review");

/**
 * Permissions for "admin" users.
 */
/**Admin can do anything that registered can and more. */
ac.grant("admin").extend("registered");

ac.grant("admin").execute("delete")
    .on("review");


exports.read = (requester) =>
    ac.can(requester.role).execute("read").sync().on("review");

exports.readAll = (requester) =>
    ac.can(requester.role).execute("readAll").sync().on("reviews")

exports.upload = (requester) =>
    ac.can(requester.role).execute("upload").sync().on("review");

exports.update = (requester,review) =>  
    ac.can(requester.role).context({requester:requester.Id, owner:review.authorId}).execute("update").sync().on("review");

exports.delete = (requester) =>    
    ac.can(requester.role).execute("delete").sync().on("review");
