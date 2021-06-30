const mongoose = require('mongoose');

const booksSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        unique: false,
        trim: true
    }
},
{
    timestamps: true
})

const Book = new mongoose.model('Book', booksSchema);

module.exports = Book;