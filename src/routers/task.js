const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

//RESTful service for fetching all the tasks
router.get('/tasks', async (req, res) => {

    try {
        const tasks = await Task.find()
        res.status(201).send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
    
  
})

//RESTful service for fetching user by id
router.get('/tasks/:id', async (req, res) => {

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
router.patch('/tasks/:id', async (req, res) => {

    //Checks validity of the update
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid update operations.'})
    }

    const _id = req.params.id

    try {
        const task = await Task.findById(_id)
        if(!task) {
            return res.status(404).send()
        }

        updates.forEach(updateOperation => task[updateOperation] = req.body[updateOperation])
        await task.save()
        // const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true})

        res.send(task)
    } catch(error) {
        res.status(400).send(error)
    }
})
 
//RESTful service for create new task
router.post('/tasks', auth, async (req, res) => {
    const newTask = new Task({
        ...req.body,
        owner: req.user._id
    })
    
    try {
        await newTask.save()
        res.status(201).send(newTask)
    } catch (error) {
        res.status(400).send(error)
    }

   
})

//RESTful service to delete task by id
router.delete('/tasks/:id', async(req, res) => {
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

module.exports = router
