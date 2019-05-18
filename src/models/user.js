const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, 
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid ')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes("password")) {
                throw new Error('Please do not inlcude the phrase "password" in your password.')
            }
        } 
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be a positive number.')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
} )  

//Setting up virtual field in user to have tasks.
userSchema.virtual ('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    console.log('user-', userObject)

    return userObject
}

//Generate JWT token
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString()}, 'thisismynewcourse')
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

//Method to get user by credentials
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if(!user) {
        throw new Error('Incorrect email.')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    console.log(isMatch)
    if(!isMatch) {
        throw new Error('Incorrect password.')
    }

    return user
}

//executed before save. Since we need this binding, standard function is used instead of arrow func.
userSchema.pre('save', async function (next) {

    const user = this
    
    if(user.isModified('password')) {
        user.password= await bcrypt.hash(user.password, 8)
    }

    next()
})

//Delete user tasks when user is removed.
userSchema.pre('remove', async function (next) {
        const user = this
        await Task.deleteMany({ owner: user._id})
        next()
}) 

const User = mongoose.model('User', userSchema)

module.exports = User