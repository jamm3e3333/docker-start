const express = require('express');
const User = require('../models/user');
const router = new express.Router();

router.post('/users/create', async (req, res) => {
    const user = new User(req.body);
    try{
        if(!user) {
            return res.status(400)
                        .send("User cannot be created.");
        }
        await user.save();
    }
    catch(e) {
        res.status(400)
            .send();
    }
    
})

module.exports = router;