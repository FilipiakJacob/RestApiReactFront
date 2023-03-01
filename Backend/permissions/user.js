const AccessControl = require("role-acl");

const ac = new AccessControl();


/**
 * Permissions for "registered" users.
 */

/**Registered can do anything that unregistered can and more. */
ac.grant("user").condition({Fn:"EQUALS", args: {"requester":"$.owner"}}).execute("read")
    .on("user", ["*", "!password", "!passwordSalt"]);

ac.grant("user").condition({Fn:"EQUALS", args: {"requester":"$.owner"}}).execute("update")
    .on("user", ["email","password"]);



/**Registered users can update users */
ac.grant("registered").execute("update")
    .on("user");

ac.grant("registered").condition({Fn:"EQUALS", args: {"requester":"$.owner"}}).execute("delete")
    .on("user");

/**
 * Permissions for "admin" users.
 */
/**Admin can do anything that registered can and more. */
ac.grant("admin").extend("registered");

ac.grant("admin").execute("readAll")
    .on("users");
/**Admin can delete any account aside from admin account */
ac.grant("admin").condition({Fn:"NOT_EQUALS", args: {"requester":"$.owner"}}).execute("delete")
    .on("user");

exports.read = (requester, owner) =>
    ac.can(requester.role).context({requester:requester.ID, owner:owner.ID}).execute("read").sync().on("user");

exports.readAll = (requester) =>
    ac.can(requester.role).execute("readAll").sync().on("users");

exports.update = (requester, owner) =>  
    ac.can(requester.role).context({requester:requester.ID, owner:owner.ID}).execute("update").sync().on("user");

exports.delete = (requester, owner) =>    
    ac.can(requester.role).context({requester:requester.ID, owner:owner.ID}).execute("delete").sync().on("user");
