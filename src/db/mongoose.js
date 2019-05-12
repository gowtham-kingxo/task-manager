const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1/task-manager', {
    useNewUrlParser: true,
    useCreateIndex: true
})

const User = mongoose.model('User', {
    name: {
        type: String
    }, 
    age: {
        type: Number
    }
})

const Task = mongoose.model('Task', {
    description: {
        type: String
    }, 
    completed: {
        type: Boolean
    }
})