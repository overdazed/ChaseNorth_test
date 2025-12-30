const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// define the user schema
// new mongoose.Schema() will help us define the structure, types and validation rules for the entries in our database
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
},
    { timestamps: true }
);

// declare a Password Hash middleware, that will have the users password hashed before storing it to the database
// userSchema.pre is a mongoose middleware hook what will get executed before the save operation
// this will be a async operation, that will take "next" as a parameter
// We will use next parameter to make sure that the next middleware or other operations run after this code
userSchema.pre('save', async function (next) {
    // when you are not modifying the password, when you are updating the entry, skip this process, continue with the other operations
    if (!this.isModified('password')) return next();

    // salt = makes use of the generate salt method, that will take a number, the higher the number, more secure it will be, but it can be slower
    const salt = await bcrypt.genSalt(10);

    // update the password with the hash value that get's generated using the salt value
    this.password = await bcrypt.hash(this.password, salt);
    // after this runs, ensure you specify the next middleware, so it will go ahead with the rest of the operations
    next();
})

// Now that we are hashing the password, we'll also require a method that will compare the plain text password that the user enters during the login
// and compare it with the hashed password stored in our database

userSchema.methods.matchPassword = async function (enteredPassword) {
    // returns a boolean value by using the compare function available in bcrypt library
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
};

// In User.js, add this method to your UserSchema
userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '1d' }
    );
};

module.exports = mongoose.model('User', userSchema);