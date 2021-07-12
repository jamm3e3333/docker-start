const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();

//CREATING A USER
router.post('/api/v1/users/create', async (req, res) => {
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
            req.session.user = data;
            res.status(201)
                .send(data);
        });
        
    }
    catch(e) {
        res.status(400)
            .send();
    }
    
});

//LOGIN USER
router.post('/api/v1/users/login', async (req, res) => {
    try{
        if(!req.body) {
            return res.status(400)
                        .send("Unable to login.");
        }
        const { name, password } = req.body;
        
        const user = await User.findByCredentials(name, password);
        req.session.user = user;
        res.status(200)
            .send(user);
    }
    catch(e) {
        res.status(401)
            .send({Error: e.message});
    }
})

//LISTING A USER
router.get('/api/v1/users/list', auth, async (req, res) => {
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
router.get('/api/v1/users/list/all/', auth, async (req, res) => {
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
router.patch('/api/v1/users/update', auth, async (req, res) => {
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
router.delete('/api/v1/users/delete', auth, async (req, res) => {
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