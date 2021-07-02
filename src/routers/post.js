const Post = require('../models/post');
const express = require('express');
const auth = require('../middleware/auth');
const router = new express.Router();

//CREATING A POST
router.post('/posts/create', auth, async (req, res) => {
    try{
        if(!req.body) {
            return res.status(400)
                        .send("Empty body!");
        }
        const post = new Post(req.body);
        await post.save();
        res.status(201)
            .send(post);
    }
    catch(e){
        res.status(400)
            .send({Error: e.message});
    }
});

//LISTING ONE POST
router.get('/posts/list', auth, async(req, res) => {
    try{
        if(!req.query.title) {
            return res.status(400)
                .send("The title is not specified")
        }
        const post = await Post.findOne({title: new RegExp(`.*${req.query.title}*.`,'i')});
        if(!post) {
            return res.status(400)
                        .send(`There's no post with title like: ${req.query.title}.`);
        }
        res.status(200)
            .send(post);
    }
    catch(e) {
        res.status(400)
            .send({Error: e.message});
    }
})

//LISTING ALL THE POSTS
router.get('/posts/list/all', auth, async (req, res) => {
    const sort = {};
    
    try{
        if(req.query.sortBy) {
            const parts = req.query.sortBy.split(":");
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }

        const post = await Post.find({})
                                .sort(sort)
                                .limit(Number.parseInt(req.query.limit))
                                .skip(Number.parseInt(req.query.skip));
        res.status(200)
            .send(post);
    }
    catch(e) {
        res.status(400)
            .send({Error: e.message});
    }
});

//UPDATING POST
router.patch('/posts/update', auth, async (req, res) => {
    try{
        const updatesAllowed = ['title', 'body'];
        const updates = Object.keys(req.body);
        if(!req.query.title) {
            return res.status(400)
                        .send(`The title cannot be empty.`);
        }
        if(!updates) {
            return res.status(400)
                        .send("There are no keys to be updated.");
        }
        const isUpdate = updates.every((update) => {
            return updatesAllowed.includes(update);
        });
        
        if(!isUpdate) {
            return res.status(400)
                        .send("Update is not allowed.");
        }

        const post = await Post.findOne({title: req.query.title});
        if(!post) {
            return res.status(404)
                        .send(`The title ${req.query.title} was not found.`);
        }

        updates.forEach((update) => {
            post[update] = req.body[update];
        });

        await post.save();
        res.status(200)
            .send(post);
    }
    catch(e) {
        res.status(400)
            .send({Error: e.message});
    }

});

//DELETING POST
router.delete('/posts/delete', auth, async(req, res) => {
    try{
        if(!req.query.title) {
            return res.status(400)
                        .send("Title must be specified.");
        }
        await Post.deleteOne({title: req.query.title}, (error, data) => {
            if(error) {
                return res.status(400)  
                            .send({Error: error.message});
            }
            if(!data.deletedCount) {
                return res.status(400)
                            .send(`Data with the title <${req.query.title}> was not deleted.`);
            }
            res.status(200)
                .send("Data deleted.");
        });
    }
    catch(e) {
        res.status(400)
            .send({Error: e.message});
    }
});

module.exports = router;