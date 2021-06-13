const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send(`
    <h1>Hello world</h1>
    <h2>My name is Jeff!</h2>
    `);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
