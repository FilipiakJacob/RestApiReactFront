
//index.js is the entrypoint of the backend application. 

const Koa = require('koa');

//Create a new instance of Koa
const app = new Koa();

//Import the files responsible for API routes/endpoints.
const author = require("./routes/author");
const book = require("./routes/book");
const review = require("./routes/review");

app.use(author.routes());
app.use(book.routes());
app.use(review.routes());