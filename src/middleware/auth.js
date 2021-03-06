const auth = (req, res, next) => {
    const { user } = req.session;
    if(!user) {
        return res.status(401)
                    .send({Error: "Failed."});
    }

    req.user = user;

    next();
}

module.exports = auth;