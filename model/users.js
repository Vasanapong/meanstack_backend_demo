const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    classrooms: [{
        title:String,
        description:String,
        image:String,
        price:String
    }]
})

const User = mongoose.model('users', usersSchema)

module.exports = User