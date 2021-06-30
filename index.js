const express = require("express");
const mongoose = require('mongoose');
const Book = require('./src/models/books');
const app = express();

const port = process.env.PORT;

app.use(express.json());

mongoose.connect(process.env.DB_CON,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(() => {console.log("Connected succesfully")})
.catch((e) => {
    console.log(e);
});

app.get("/", (req, res) => {
    res.send(`
    <h1>Hello world</h1>
    <h2>My name is Jeff!</h2>
    <h2>Hi Jeff how are you?</h2>
    <h3>I'm fine thanks</h3>
    <h3>I'm fine thanks</h3>
    `);
});

app.post('/books/create', async (req, res) => {
    try{
        const book = new Book(req.body);
        if(!book) {
            res.status(400)
                .send("Empty body!");
        }

        await book.save(book);
        res.status(201)
            .send(book);

    }
    catch(e){
        res.status(400)
            .send({Error: e.message});
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
