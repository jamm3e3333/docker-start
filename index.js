const express = require("express");
const app = express();
const routerPost = require("./src/routers/post");
require('./src/db/mongodb');

const port = process.env.PORT;

app.use(express.json());
app.use(routerPost);

app.get("/", (req, res) => {
    res.send(`
    <h1>Hello world</h1>
    <h2>My name is Jeff!</h2>
    <h2>Hi Jeff how are you?</h2>
    <h3>I'm fine thanks</h3>
    <h3>I'm fine thanks</h3>
    `);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
