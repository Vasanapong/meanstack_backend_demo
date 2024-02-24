const express = require('express')
const router = express.Router()
const Classroom = require('../model/classrooms')

// Get Classrooms
router.get('/',async (req,res)=>{
    try{
        let result = await Classroom.find()
        res.json({'data':result})
    }catch(error){
        res.status(400).json({'message':error.message})
    }
})

// Add Classroom
router.post('/',async (req,res)=>{
    try{
        let classroom = new Classroom({
            title:req.body.classroomTitle,
            description:req.body.classroomDescription,
            image:req.body.classroomImage,
            price:req.body.classroomPrice
        })

        let result = await classroom.save()
        res.json({'data':result})
    }catch(error){
        res.status(400).json({'message':error.message})
    }
})

module.exports = router