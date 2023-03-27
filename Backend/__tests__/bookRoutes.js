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
        .get("/api/v1/login").auth("barbara", "barbara")
    REGISTERED_TOKEN = res2.body.token;
});

describe("Unregistered get all books.", ()=>
{
    it("Should return books.",async()=>
    {
        const res = await request(app.callback())
        .get("/api/v1/book")
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    "id": expect.any(Number),
                    "name": expect.any(String),
                    "authorId": expect.any(Number),
                    "date": expect.any(String),
                    "isbn": expect.any(String),
                    "description": expect.any(String),
                    "cover": expect.any(String)
                })
            ])
        )
    })
})

describe("Registered post new book.", ()=>
{
    it("Should create a new book", async()=>
    {
        const res = await request(app.callback())
        .post("/api/v1/book")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        .send({
            "name": "testbook",
            "authorId": 1,
            "date": "2019-08-24",
            "isbn": "StringStringst",
            "description": "testdesc",
            "cover": "testcover",
            "contents": "testcont"
            })
        expect(res.statusCode).toEqual(201)
    })
})

describe("Unregistered post new book.", ()=>
{
    it("Should return verification error", async()=>
    {
        const res = await request(app.callback())
        .post("/api/v1/book")
        .send({
            "name": "testbook",
            "authorId": 1,
            "date": "2019-08-24",
            "isbn": "StringStringst",
            "description": "testdesc",
            "cover": "testcover",
            "contents": "testcont"
            })
        expect(res.statusCode).toEqual(401)
        expect.objectContaining({
        "id": expect.any(Number),
        })
    })
})

describe("Registered post new book missing values in schema schema.", ()=>
{
    it("Should throw schema validation error", async()=>
    {
        const res = await request(app.callback())
        .post("/api/v1/book")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        .send({
            "name": "testbook",
            "authorId": 1,
            "date": "2019-08-24",
            "isbn": "StringStringst",
            "description": "testdesc",
            "cover": "testcover",
            })
        expect(res.statusCode).toEqual(400)
    })
})

describe("Registered post new book additional value in schema.", ()=>
{
    it("Should return schema validation error", async()=>
    {
        const res = await request(app.callback())
        .post("/api/v1/book")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        .send({
            "name": "testbook",
            "authorId": 1,
            "date": "2019-08-24",
            "isbn": "StringStringst",
            "description": "testdesc",
            "cover": "testcover",
            "contents": "testcont",
            "approved": 1
            })
        expect(res.statusCode).toEqual(400)
    })
})


describe("Unregistered book by ID (approved book).", ()=>
{
    it("Should return book resource with contents.",async()=>
    {
        const res = await request(app.callback())
        .get("/api/v1/book/1")
        expect(res.statusCode).toEqual(200)
        expect.objectContaining({
            "id": 1,
            "name": "Dziady",
            "authorId": 4,
            "date": expect.any(String),
            "isbn": expect.any(String),
            "description": expect.any(String),
            "cover": expect.any(String),
            "contents": expect.any(String),
            "approved": 1
        })
    })
})


describe("Registered get book by ID (unapproved book).", ()=>
{
    it("Should return permissions error.",async()=>
    {
        const res = await request(app.callback())
        .get("/api/v1/book/2")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        expect(res.statusCode).toEqual(403)
    })
})

describe("Admin get book by ID (unapproved book).", ()=>
{
    it("Should return book resource with contents.",async()=>
    {
        const res = await request(app.callback())
        .get("/api/v1/book/2")
        .auth(ADMIN_TOKEN, { type: 'bearer' })
        expect(res.statusCode).toEqual(200)
        expect.objectContaining({
            "id": 2,
            "name": "Lalka",
            "authorId": 1,
            "date": expect.any(String),
            "isbn": expect.any(String),
            "description": expect.any(String),
            "cover": expect.any(String),
            "contents": expect.any(String),
            "approved": 0
        })
    })
})

describe("Registered modify approved book.", ()=>
{
    it("Should modify succesfully and return modified data.",async()=>
    {
        const res = await request(app.callback())
        .put("/api/v1/book/4")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        .send({         
            "name": "testbook2",
            "authorId": 12,
            "date": "2019-08-24",
            "isbn": "StringStrings2",
            "description": "testdesc2",
            "cover": "testcover2",
            "contents": "testcont2"
        })
        expect(res.statusCode).toEqual(204)
                
        const res2 = await request(app.callback())
        .get("/api/v1/book/1")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        expect(res2.statusCode).toEqual(200)
        expect.objectContaining({
            "id": expect("1"),
            "name": expect("testbook2"),
            "authorId":expect(12),
            "date": expect("2019-08-24"),
            "isbn": expect("StringStringst2"),
            "description": expect("testdesc2"),
            "cover": expect("testcover2"),
            "contents": expect("testcont2"),
            "approved": expect(1)
        })
    })
})


describe("Registered delete a book.", ()=>
{
    it("Should return permission error.",async()=>
    {
        const res = await request(app.callback())
        .delete("/api/v1/book/1")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        expect(res.statusCode).toEqual(403)
    })
})

describe("Admin get all unapproved books.", ()=>
{
    it("Should return books.",async()=>
    {
        const res = await request(app.callback())
        .get("/api/v1/book/unapproved")
        .auth(ADMIN_TOKEN, { type: 'bearer' })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    "id": expect.any(Number),
                    "name": expect.any(String),
                    "authorId": expect.any(Number),
                    "date": expect.any(String),
                    "isbn": expect.any(String),
                    "description": expect.any(String),
                    "cover": expect.any(String)
                })
            ])
        )
        console.log(res.body)
    })
})

describe("Admin delete a book.", ()=>
{
    it("Should return success.",async()=>
    {

        const res = await request(app.callback())
        .delete("/api/v1/book/3")
        .auth(ADMIN_TOKEN, { type: 'bearer' })
        expect(res.statusCode).toEqual(204)
    })
})

describe("Admin approve book.", ()=>
{
    it("Should modify succesfully.",async()=>
    {
        const res = await request(app.callback())
        .patch("/api/v1/book/unapproved/3")
        .auth(ADMIN_TOKEN, { type: 'bearer' })
        .send({
            "id":3,
            "approved":"approve"
        })
        expect(res.statusCode).toEqual(204)
                
    })
})