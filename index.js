const express = require("express");
const session = require("express-session");
const cors = require("cors");
const redis = require("redis");
const { redisUrl, redisPort, redisSecret } = require('./config/config');
const app = express();
const routerPost = require("./src/routers/post");
const routerUser = require("./src/routers/user");


let RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient({
    host: redisUrl,
    port: redisPort
});

require('./src/db/mongodb');

const port = process.env.PORT;

app.enable("trust proxy");
app.use(cors());
app.use(session({
    store: new RedisStore({
        client: redisClient
    }),
    secret: redisSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 3000000
    } 
}))
app.use(express.json());
app.use(routerPost);
app.use(routerUser);

app.get("/api/v1", (req, res) => {

    res.send(`
    <h1>Hello world</h1>
    <h2>My name is Jeff!</h2>
    <h2>Hi Jeff how are you?</h2>
    <h3>I'm fine thanks</h3>
    <h3>I'm fine thanks</h3>
    `);
    console.log('it really runs.');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
