const express = require('express')
const bcrypt = require('bcryptjs')

require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

//Parses json body from request
app.use(express.json())

app.use(userRouter)
app.use(taskRouter)

module.exports = app