// Require Dependency

const express = require('express')
const app = express()

const cors = require('cors')

require('dotenv').config()

const mongoose = require('mongoose')

// Import Router

const usersRouter = require('./routes/users')
const classroomsRouter = require('./routes/classrooms')

// Running App

app.use(cors())

app.use(express.json())

app.use('/api/users',usersRouter)
app.use('/api/classrooms',classroomsRouter)

mongoose.connect(process.env.MONGO_LINK,{dbName:'portfolio_database'})
        .then(()=>console.log('Connected to database successfully!'))
        .catch((error)=>console.log(error))

const port = process.env.PORT
app.listen(port,()=>console.log(`App is running on port ${port}...`))