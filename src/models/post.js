const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        required: [true, "post must have title"],
        type: String,
        unique: true,
        trim: true,
    },
    body: {
        type: String,
        required: [true, "post must have body"]
    }
},
{
    timestamps: true
})

const Post = mongoose.model('Post', postSchema);

module.exports = Post;