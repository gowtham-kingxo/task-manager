const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

//Parses json body from request
app.use(express.json())

//RESTful service for fetching all the users
app.get('/users', (req, res) => {
    User.find()
        .then(users => {
            res.status(201).send(users)
        })
        .catch(error => {
            res.status(500).send(error)
        })
})

//RESTful service for fetching user by id
app.get('/users/:id', (req, res) => {

    const _id = req.params.id
    User.findById(_id)
        .then(user => {
            if(!user) {
               return res.status(404).send()
            }

            res.send(user)
        })
        .catch(error => {
            res.status(500).send()
        })
})

//RESTful service for create new user
app.post('/users', (req, res) => {
    const newUser = new User(req.body)
    
    newUser.save()
        .then(() => {
            res.status(201).send(newUser)
        })
        .catch((error) => {
            res.status(400).send(error)
        })
    
})

//RESTful service for create new task
app.post('/tasks', (req, res) => {
    const newTask = new Task(req.body)

    newTask.save()
        .then(() => {
            res.status(201).send(newTask)
        })
        .catch(error => {
            res.status(400).send(error)
        })
})



app.listen(port, () => {
    console.log('Server is up on port ' + port)
})