require('../db/mongoose')
const User = require('../models/user')
const Task = require('../models/task')

//5cd7b333f5b8a83abce237b9

// Task.deleteOne({_id: '5cd7c36e59eada2ea8740f34'})
//     .then(() => {
//         return Task.countDocuments({completed: false})
//     })
//     .then((count) => {
//         console.log('count', count)
//     })
//     .catch(error => {
//         console.log(error)
//     }) 

//async example
const deleteTask = async () => {
    await Task.deleteOne({_id: '5cd7e2da81d0241110bee8d1'})
    const count = await Task.countDocuments({completed: false})
    console.log('count', count)
}

deleteTask()

    

// const task = new Task({
//     description: 'hyoo',
//     completed: true
// })

// task.save().then((result) => {
//     console.log(result)
// })
// .catch(e => {
//     console.log(e)
// })


