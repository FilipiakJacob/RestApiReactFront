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

describe("Unregistered get all authors.", ()=>
{
    it("Should return authors.",async()=>
    {
        const res = await request(app.callback())
        .get("/api/v1/author")
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    "id": expect.any(Number),
                    "name": expect.any(String)
                })
            ])
        )
    })
})

describe("Registered post new author.", ()=>
{
    it("Should create a new author", async()=>
    {
        const res = await request(app.callback())
        .post("/api/v1/author")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        .send({
            "name": "testauthor"
            })
        expect(res.statusCode).toEqual(201)
    })
})

describe("Unregistered post new author.", ()=>
{
    it("Should return verification error", async()=>
    {
        const res = await request(app.callback())
        .post("/api/v1/author")
        .send({
            "name": "testauthor"
            })
        expect(res.statusCode).toEqual(401)
        expect.objectContaining({
        "id": expect.any(Number),
        })
    })
})

describe("Registered post new author missing values in schema.", ()=>
{
    it("Should throw schema validation error", async()=>
    {
        const res = await request(app.callback())
        .post("/api/v1/author")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        .send({
            })
        expect(res.statusCode).toEqual(400)
    })
})

describe("Registered post new author additional value in schema.", ()=>
{
    it("Should return schema validation error", async()=>
    {
        const res = await request(app.callback())
        .post("/api/v1/author")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        .send({
            "name": "testauthor",
            "approved": 1
            })
        expect(res.statusCode).toEqual(400)
    })
})


describe("Unregistered get author by ID (approved author).", ()=>
{
    it("Should return author resource.",async()=>
    {
        const res = await request(app.callback())
        .get("/api/v1/author/3")
        expect(res.statusCode).toEqual(200)
        expect.objectContaining({
            "id": 3,
            "name": "Henryk Sienkiewicz"
        })
    })
})


describe("Registered get author by ID (unapproved author).", ()=>
{
    it("Should return permissions error.",async()=>
    {
        const res = await request(app.callback())
        .get("/api/v1/author/5")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        expect(res.statusCode).toEqual(403)
    })
})

describe("Admin get author by ID (unapproved author).", ()=>
{
    it("Should return author resource.",async()=>
    {
        const res = await request(app.callback())
        .get("/api/v1/author/5")
        .auth(ADMIN_TOKEN, { type: 'bearer' })
        expect(res.statusCode).toEqual(200)
        expect.objectContaining({
            "id": 5,
            "name": "Juliusz Slowacki",
        })
    })
})

describe("Registered modify approved author.", ()=>
{
    it("Should modify succesfully and return modified data.",async()=>
    {
        const res = await request(app.callback())
        .put("/api/v1/author/4")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        .send({         
            "name": "Adam Mickiewicz2",
        })
        expect(res.statusCode).toEqual(204)
                
        const res2 = await request(app.callback())
        .get("/api/v1/author/4")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        expect(res2.statusCode).toEqual(200)
        expect.objectContaining({
            "id": expect("4"),
            "name": expect("Adam Mickiewicz2"),
        })
    })
})


describe("Registered delete a author.", ()=>
{
    it("Should return permission error.",async()=>
    {
        const res = await request(app.callback())
        .delete("/api/v1/author/1")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        expect(res.statusCode).toEqual(403)
    })
})

describe("Admin get all unapproved authors.", ()=>
{
    it("Should return authors.",async()=>
    {
        const res = await request(app.callback())
        .get("/api/v1/author/unapproved")
        .auth(ADMIN_TOKEN, { type: 'bearer' })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    "id": expect.any(Number),
                    "name": expect.any(String)
                })
            ])
        )
    })
})

describe("Admin delete an author.", ()=>
{
    it("Should return success.",async()=>
    {

        const res = await request(app.callback())
        .delete("/api/v1/author/6")
        .auth(ADMIN_TOKEN, { type: 'bearer' })
        expect(res.statusCode).toEqual(204)
    })
})

describe("Admin approve author.", ()=>
{
    it("Should modify succesfully.",async()=>
    {
        const res = await request(app.callback())
        .patch("/api/v1/author/unapproved/5")
        .auth(ADMIN_TOKEN, { type: 'bearer' })
        .send({
            "approved":"approve"
        })
        expect(res.statusCode).toEqual(204)
                
    })
})