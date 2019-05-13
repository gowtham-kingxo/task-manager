const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

//Parses json body from request
app.use(express.json())

//RESTful service for fetching all the users
app.get('/users', async (req, res) => {

    try {
        const users = await User.find()
        res.status(201).send(users)
    } catch (error) {
        res.status(500).send(error)
    }
   
   
})



//RESTful service for fetching user by id
app.get('/users/:id', async (req, res) => {

    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if(!user) {
            return res.status(404).send()
         }
         res.send(user)
    } catch (error) {
        res.status(500).send()
    }
   
})

//RESTful service for updating a user
app.patch('/users/:id', async (req, res) => {

    //Checks validity of the update
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid update operations.'})
    }

    const _id = req.params.id

    try {
        const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true})

        if(!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch(error) {
        res.status(400).send(error)
    }
})

//RESTful service for create new user
app.post('/users', async (req, res) => {
    const newUser = new User(req.body)

    try {
        await newUser.save()
        res.status(201).send(newUser)
    } catch(error) {
        res.status(400).send()
    }
   
})

//RESTful service to delete user by id
app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if(!user) {
            res.status(404).send()
        }

        res.send(user)
    } catch (error) {
        res.status(500).send()
    }
})


//RESTful service for fetching all the tasks
app.get('/tasks', async (req, res) => {

    try {
        const tasks = await Task.find()
        res.status(201).send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
    
  
})

//RESTful service for fetching user by id
app.get('/tasks/:id', async (req, res) => {

    const _id = req.params.id

    try {
        const task = await Task.findById(_id)
        if(!task) {
            return res.status(404).send()
         }

         res.send(task)
    } catch (error) {
        res.status(500).send()
    }
    
})


//RESTful service for updating a task
app.patch('/tasks/:id', async (req, res) => {

    //Checks validity of the update
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid update operations.'})
    }

    const _id = req.params.id

    try {
        const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true})

        if(!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch(error) {
        res.status(400).send(error)
    }
})
 
//RESTful service for create new task
app.post('/tasks', async (req, res) => {
    const newTask = new Task(req.body)
    
    try {
        await newTask.save()
        res.status(201).send(newTask)
    } catch (error) {
        res.status(400).send(error)
    }

   
})



app.listen(port, () => {
    console.log('Server is up on port ' + port)
})