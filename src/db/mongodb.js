const mongoose = require('mongoose');
const { 
    mongoUser,
    mongoPass,
    mongoIP,
    mongoPort
} = require('../../config/config');

const connectWithRetry = () => {
    mongoose.connect(`mongodb://${mongoUser}:${mongoPass}@${mongoIP}:${mongoPort}/?authSource=admin`,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => {console.log("Connected succesfully")})
    .catch((e) => {
        console.log(e);
        setTimeout(connectWithRetry, 5000);
    });
}

connectWithRetry();