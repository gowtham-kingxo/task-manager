const express = require('express')
require('./db/mongoose')
const User = require('./models/user')

const app = express()
const port = process.env.PORT || 3000

//Parses json body from request
app.use(express.json())

//RESTful service for create new user
app.post('/users', (req, res) => {
    const newUser = new User(req.body)
    
    newUser.save()
        .then(() => {
            res.send(newUser)
        })
        .catch((error) => {
            res.status(400).send(error)
        })
    
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})