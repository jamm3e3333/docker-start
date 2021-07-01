const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        required: true,
        unique: true,
        type: String,
        trime: true,
        validate(value){
            if(value.length < 3){
                throw new Error("The length of the name must be at least 3characters.");
            }
        }
    },
    password: {
        required: true,
        unique: false,
        type: String,
        validate(value) {
            if(value.length < 6) {
                throw new Error("The password must be at least 6 letters long.");
            }
            if(value.toLowerCase().includes("password")) {
                throw new Error("The password conatain word \"password\".")
            }
        }
    }
},{
    timestamps: true
});

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
}

userSchema.statics.findByCredentials = async (name, password) => {
    const user = await User.findOne({name});
    if(!user) {
        throw new Error("Invalid name or password.");
    }

    const isValidation = await bcrypt.compare(user.password, password);
    if(!isValdiation) {
        throw new Error("Invalid name or password.");
    }
    return user;
}

userSchema.pre('save', async function (next) {
    const user = this;
    if(user.isModified) {
        user.password = bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;