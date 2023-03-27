const request = require("supertest")
const app = require("../app")

let ADMIN_TOKEN = "";
let REGISTERED_TOKEN = "";

beforeAll(async () => 
{
    const res= await request(app.callback())
        .get("/api/v1/login").auth("admin", "admin")
    ADMIN_TOKEN = res.body.token;
    const res2= await request(app.callback())
        .get("/api/v1/login").auth("john", "john")
    REGISTERED_TOKEN = res2.body.token;
});

describe("Admin get all users.", ()=>
{
    it("Should get a list of all users.",async()=>
    {
        const res = await request(app.callback())
        .get("/api/v1/user")
        .auth(ADMIN_TOKEN, { type: 'bearer' })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    "id": expect.any(Number),
                    "username": expect.any(String),
                    "email": expect.any(String),
                    "role": expect.any(String)
                })
            ])
        )
    })
})

describe("Registered get all users.", ()=>
{
    it("Should throw permission error.",async()=>
    {
        const res = await request(app.callback())
        .get("/api/v1/user")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        expect(res.statusCode).toEqual(403)
    })
})

describe("Unregistered get all users.", ()=>
{
    it("Should throw authorization error.",async()=>
    {
        const res = await request(app.callback())
        .get("/api/v1/user")
        expect(res.statusCode).toEqual(401)
    })
})


describe("Post new user.", ()=>
{
    it("Should create a new user", async()=>
    {
        const res = await request(app.callback())
        .post("/api/v1/user")
        .send({
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "newuser"
            })
        expect(res.statusCode).toEqual(201)
    })
})

describe("Registered get own user ID.", ()=>
{
    it("Should return user data.",async()=>
    {
        const res = await request(app.callback())
        .get("/api/v1/user/2")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        expect(res.statusCode).toEqual(200)
        expect.objectContaining({
            "id": expect("2"),
            "username": expect("john"),
            "email": expect("john@john.com"),
            "role": expect("registered")
        })
    })
})

describe("Registered get someone else's ID.", ()=>
{
    it("Should return permission error.",async()=>
    {
        const res = await request(app.callback())
        .get("/api/v1/user/1")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        expect(res.statusCode).toEqual(403)
    })
})

describe("Unegistered get ID.", ()=>
{
    it("Should return permission error.",async()=>
    {
        const res = await request(app.callback())
        .get("/api/v1/user/1")
        expect(res.statusCode).toEqual(401)
    })
})


describe("Registered modify own account.", ()=>
{
    it("Should modify succesfully and return modified data.",async()=>
    {
        const res = await request(app.callback())
        .put("/api/v1/user/2")
        .send({
            "username": "john2",
            "email": "john2@john2.com",
            "password":"john2"
        })
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        expect(res.statusCode).toEqual(204)
                
        const res2 = await request(app.callback())
        .get("/api/v1/user/2")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        expect(res2.statusCode).toEqual(200)
        expect.objectContaining({
            "id": expect("2"),
            "username": expect("john2"),
            "email": expect("john2@john2.com"),
            "role": expect("registered")
        })
    })
})

describe("Registered delete someone's account.", ()=>
{
    it("Should return permission error.",async()=>
    {
        const res = await request(app.callback())
        .delete("/api/v1/user/3")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        expect(res.statusCode).toEqual(403)
    })
})

describe("Registered delete own account.", ()=>
{
    it("Should succesfully delete account.",async()=>
    {
        const res = await request(app.callback())
        .delete("/api/v1/user/2")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        expect(res.statusCode).toEqual(204)
    })
})