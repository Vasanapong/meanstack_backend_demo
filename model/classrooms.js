const mongoose = require('mongoose')

const classroomsSchema = new mongoose.Schema({
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: String, required: true }
})

const Classroom = mongoose.model('classrooms', classroomsSchema)

module.exports = Classroom