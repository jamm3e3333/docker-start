const express = require('express');
const User = require('../models/user');
const router = new express.Router();

//CREATING A USER
router.post('/users/create', async (req, res) => {
    const user = new User(req.body);
    try{
        if(!user) {
            return res.status(400)
                        .send("User cannot be created.");
        }
        await user.save((error, data) => {
            if(error) {
                return res.status(400)
                            .send({Error: error.message});
            }
            res.status(201)
                .send(data);
        });
        
    }
    catch(e) {
        res.status(400)
            .send();
    }
    
});

//LISTING A USER
router.get('/users/list', async (req, res) => {
    const name = req.query.name;
    try{
        if(!name) {
            return res.status(400)
                        .send("Name must be specified.");
        }
        await User.find({name}, (error, data) => {
            if(error) {
                return res.status(400)
                            .send({Error: error.message});
            }
            if(!data.length) {
                return res.status(404)
                    .send("User not found.");
            }
            res.status(200)
                .send(data);
        });
    }
    catch(e) {
        res.status(400)
            .send({Error: e.message});
    }
})

//LISTING ALL USERS
router.get('/users/list/all/', async (req, res) => {
    const sort = {};

    try{
        if(req.query.sortBy) {
            const parts = req.query.sortBy.split(":");
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }
        const user = await User.find({})
                                .sort(sort)
                                .limit(Number.parseInt(req.query.limit))
                                .skip(Number.parseInt(req.query.skip));
        if(!user) {
            res.status(400)
                .send("There are no users.");
        }
        res.status(200)
            .send(user);
    }
    catch(e) {
        res.status(400)
            .send({Error: e.message});
    }
});

//UPDATE A USER
router.patch('/users/update', async (req, res) => {
    const updatesAllowed = ['name','password'];
    const updates = Object.keys(req.body);
    const name = req.query.name;
    try{
        if(!name) {
            return res.status(400)
                        .send("User must be specified.");
        }
        if(!updates) {
            return res.status(400)
                        .send("There are no keys to be updated.");
        }
        const isUpdated = updates.every((update) => {
            return updatesAllowed.includes(update);
        })
        if(!isUpdated) {
            return res.status(400)
                        .send("Update not allowed.");
        }
        const user = await User.find({name});

        if(!user) {
            return res.status(404)
                        .send("User not found.");
        }
        updates.forEach((update) => {
            user[update] = req.body[update];
        });

        await user.save((error, data) => {
            if(error) {
                return res.status(400)
                            .send({Error: error.message});
            }
            if(!data) {
                return res.status(400)
                            .send();
            }
            res.status(200)
                .send(data);
        });
    }
    catch(e) {
        res.status(400) 
            .send({Error: e.message});
    }

});

//DELETING A USER
router.delete('/users/delete', async (req, res) => {
    try{
        const name = req.query.name;
        if(!name) {
            return res.status(400)
                        .send("The name must be specified.");
        }
        await User.deleteOne({name}, (error, data) => {
            if(error) {
                return res.status(400)
                            .send({Error: error.message});
            }
            if(!data.deletedCount) {
                return res.status(400)
                            .send("The user doesn\'t exist.");
            }
            res.status(200)
                .send("User deleted.");
        })
    }
    catch(e) {
        res.status(400)
            .send({Error: e.message});
    }
});

module.exports = router;