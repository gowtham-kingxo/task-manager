const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = process.env.MONGODB_URL
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true}, (error, client) => {

    if(error) {
        return console.log('Unable to connect to database!')
    }


    console.log('Connected successfully...')
})