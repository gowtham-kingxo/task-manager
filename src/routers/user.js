const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

//RESTful service for fetching all the users
router.get('/users/me', auth, async (req, res) => {
   res.send(req.user)
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
router.patch('/users/me', auth, async (req, res) => {

    //Checks validity of the update
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid update operations.'})
    }

    try {
        updates.forEach(updateOperation => req.user[updateOperation] = req.body[updateOperation])
        await req.user.save()

        // const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true})
        res.send(req.user)
    } catch(error) {
        console.log(error)
        res.status(400).send(error)
    }
})

//RESTful service for create new user
router.post('/users', async (req, res) => {
    const newUser = new User(req.body)

    try {
        await newUser.save()
        const token = await newUser.generateAuthToken()
        res.status(201).send({newUser, token})
    } catch(error) {
        res.status(400).send(error)
    }
   
})

//RESTful service for login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (error) {
        console.log('in catch', error)
        res.status(400).send(error.toString())
    }
})

//RESTful service for logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
       
        await req.user.save()
        res.send()
    } catch(error) {
        console.log('error', error)
        res.status(500).send()
    }
})

//RESTful service for logout from all the sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        console.log('before user: ', req.user)
        req.user.tokens = []
        console.log('after user: ', req.user)
        await req.user.save()
        res.send()
    } catch(error) {
        console.log('error', error)
        res.status(500).send()
    }
})

//RESTful service to delete user by id
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router