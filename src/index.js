const express = require('express')
require('./db/mongoose')
const Task = require('./models/task')
const userRouter = require('./routers/user')

const app = express()
const port = process.env.PORT || 3000

//Parses json body from request
app.use(express.json())

app.use(userRouter)


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

//RESTful service to delete task by id
app.delete('/tasks/:id', async(req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)

        if(!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch(error) {
        res.status(500).send()
    }
})



app.listen(port, () => {
    console.log('Server is up on port ' + port)
})