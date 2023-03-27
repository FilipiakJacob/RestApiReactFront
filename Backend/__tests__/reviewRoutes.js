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

describe("Unregistered get all reviews.", ()=>
{
    it("Should return reviews.",async()=>
    {
        const res = await request(app.callback())
        .get("/api/v1/review")
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    "id": expect.any(Number),
                    "comment": expect.any(String),
                    "rating": expect.any(Number),
                    "authorId": expect.any(Number),
                    "bookId": expect.any(Number),
                })
            ])
        )
    })
})

describe("Registered post new review.", ()=>
{
    it("Should create a new review", async()=>
    {
        const res = await request(app.callback())
        .post("/api/v1/review")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        .send({
            "comment": "terrible book, awful really",
            "rating": 1,
            "bookId": 2,
            })
        expect(res.statusCode).toEqual(201)
    })
})

describe("Unregistered post new review.", ()=>
{
    it("Should return verification error", async()=>
    {
        const res = await request(app.callback())
        .post("/api/v1/review")
        .send({
            "comment": "Book was alright",
            "rating": 5,
            "bookId": 1,
            })
        expect(res.statusCode).toEqual(401)
        expect.objectContaining({
        "id": expect.any(Number),
        })
    })
})

describe("Registered post new review missing values in schema.", ()=>
{
    it("Should throw schema validation error", async()=>
    {
        const res = await request(app.callback())
        .post("/api/v1/review")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        .send({
            "comment": "terrible book, awful really",
            "rating": 1,
            })
        expect(res.statusCode).toEqual(400)
    })
})

describe("Registered post new review additional value in schema.", ()=>
{
    it("Should return schema validation error", async()=>
    {
        const res = await request(app.callback())
        .post("/api/v1/review")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        .send({
            "comment": "terrible book, awful really",
            "rating": 1,
            "bookId": 2,
            "id":5
            })
        expect(res.statusCode).toEqual(400)
    })
})


describe("Unregistered get review by ID.", ()=>
{
    it("Should return review resource.",async()=>
    {
        const res = await request(app.callback())
        .get("/api/v1/review/1")
        expect(res.statusCode).toEqual(200)
        expect.objectContaining({
            "id": expect.any(Number),
            "comment": expect.any(String),
            "rating": expect.any(Number),
            "authorId": expect.any(Number),
            "bookId": expect.any(Number),
        })
    })
})


describe("Registered modify own review.", ()=>
{
    it("Should modify succesfully and return modified data.",async()=>
    {
        const res = await request(app.callback())
        .put("/api/v1/review/4")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        .send({
            "comment": "Maybe it wasn't that bad.",
            "rating": 4,
            })
        expect(res.statusCode).toEqual(204)
                
        const res2 = await request(app.callback())
        .get("/api/v1/review/4")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        expect(res2.statusCode).toEqual(200)
        expect.objectContaining({
            "id": expect(4),
            "comment": expect("Maybe it wasn't that bad."),
            "rating": expect(4),
            "authorId": expect.any(Number),
            "bookId": expect.any(2),
        })
    })
})

describe("Registered modify someone else's review.", ()=>
{
    it("Should return permission error.",async()=>
    {
        const res = await request(app.callback())
        .put("/api/v1/review/2")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        .send({
            "comment": "Maybe it wasn't that bad.",
            "rating": 4,
            })
        expect(res.statusCode).toEqual(403)
    })
})

describe("Registered delete someone else's review.", ()=>
{
    it("Should return permission error.",async()=>
    {
        const res = await request(app.callback())
        .delete("/api/v1/review/1")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        expect(res.statusCode).toEqual(403)
    })
})

describe("Registered delete own review.", ()=>
{
    it("Should return success.",async()=>
    {
        const res = await request(app.callback())
        .delete("/api/v1/review/4")
        .auth(REGISTERED_TOKEN, { type: 'bearer' })
        expect(res.statusCode).toEqual(204)
    })
})



describe("Admin delete someone's review.", ()=>
{
    it("Should return success.",async()=>
    {

        const res = await request(app.callback())
        .delete("/api/v1/review/1")
        .auth(ADMIN_TOKEN, { type: 'bearer' })
        expect(res.statusCode).toEqual(204)
    })
})
