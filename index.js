const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send(`
    <h1>Hello world</h1>
    <h2>My name is Jeff!</h2>
    <h2>Hi Jeff how are you?</h2>
    <h3>I'm fine thanks</h3>
    `);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
