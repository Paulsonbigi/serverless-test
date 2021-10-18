const mongoose = require("mongoose")
const { Schema } = mongoose
const { isEmail } = require('validator');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const UserSchema = new Schema ({
    full_name: {
        type: String,
        required: [ true, 'Name filed required' ]
    },
    user_name: String,
    role: {
        type: String,
        enum: ['user', "admin"],
        default: "user"
    },
    email: {
        type: String,
        required: [true, 'Email field is required'],
        lowercase: true,
        unique: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    phone_number: {
        type: String,
        unique: true,
        required: [true, 'Phone number field is required']
    },
    address: {
        type: String,
        required: [true, 'Please enter your address']
    },
    password: {
        type: String,
        minlength: 6,
        select: false,
        required: [true, 'Password field is required']
    },
    register_date: {
        type: Date,
        default: Date.now
    },
    passwordChangedAt: {
        type: Date
    },
    forgotPasswordResetToken: {
        type: String,
    },
    forgotPasswordExpires: {
        type: Date,
    },
})

// Schema.plugin(mongooseLeanVirtuals) //NOTE: import mongooseLeanVirtuals;

//NOTE: this is what I am trying to explain by the function I said that you should create
UserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next()
    }
    this.password = await bcrypt.hash(this.password, 12);
})

UserSchema.methods.getJwtToken = async function(){
    return await jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: process.env.JWT_EXPIREIN
    })
}

UserSchema.methods.comparePassword = async function(candidate, savedPassword){
    return await bcrypt.compare(candidate, savedPassword)
}

module.exports = mongoose.model("user", UserSchema)