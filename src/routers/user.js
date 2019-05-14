const express = require('express')
const User = require('../models/user')
const router = new express.Router()

//RESTful service for fetching all the users
router.get('/users', async (req, res) => {

    try {
        const users = await User.find()
        res.status(201).send(users)
    } catch (error) {
        res.status(500).send(error)
    }
   
   
})



//RESTful service for fetching user by id
router.get('/users/:id', async (req, res) => {

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
router.patch('/users/:id', async (req, res) => {

    //Checks validity of the update
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid update operations.'})
    }

    const _id = req.params.id

    try {
        const user = await User.findById(req.params.id)
        if(!user) {
            return res.status(404).send()
        }

        updates.forEach(updateOperation => user[updateOperation] = req.body[updateOperation])
        await user.save()

        // const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true})
        res.send(user)
    } catch(error) {
        res.status(400).send(error)
    }
})

//RESTful service for create new user
router.post('/users', async (req, res) => {
    const newUser = new User(req.body)

    try {
        await newUser.save()
        res.status(201).send(newUser)
    } catch(error) {
        res.status(400).send()
    }
   
})

//RESTful service for login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

//RESTful service to delete user by id
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if(!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router