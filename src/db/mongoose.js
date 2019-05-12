const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1/task-manager', {
    useNewUrlParser: true,
    useCreateIndex: true
})


const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    }, 
    completed: {
        type: Boolean,
        default: false
    }
})


const task1 = new Task({
   completed: false

})

task1.save().then(() => {
    console.log('task1')
}).catch(error => {
    console.log(error)
})