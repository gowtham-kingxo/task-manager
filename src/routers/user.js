const express = require('express')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')

const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail } = require('../emails/account')


//RESTful service for fetching all the users
router.get('/users/me', auth, async (req, res) => {
   res.send(req.user)
})

//https://app.sendgrid.com/guide/integrate/langs/nodejs

//RESTful service for fetching user by id
// router.get('/users/:id', async (req, res) => {

//     const _id = req.params.id

//     try {
//         const user = await User.findById(_id)
//         if(!user) {
//             return res.status(404).send()
//          }
//          res.send(user)
//     } catch (error) {
//         res.status(500).send()
//     }
   
// })

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
        sendWelcomeEmail(newUser.email, newUser.name)
        const token = await newUser.generateAuthToken()
        res.status(201).send({newUser, token})
    } catch(error) {
        console.log('Create new user', error)
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

//RESTful service for profile pic upload.
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error('Please upload an image.'))
        }

        callback(undefined, true)
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    //Resizing image and converting it to png
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

//RESTful service to delete profile pic.
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message})
})

//RESTful service to fetch user profile pic by id
router.get('/users/:id/avatar', async (req, res) => {
    
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)

    } catch (error) {
        console.log(error)
        res.status(404).send()
    }
})




module.exports = router