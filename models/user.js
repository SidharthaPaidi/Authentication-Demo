const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    }
});

userSchema.statics.findAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ username: username });
    if (!foundUser) return false;
    const validPassword = await bcrypt.compare(password, foundUser.password);
    return validPassword ? foundUser : false;
}

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User;