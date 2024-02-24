const express = require('express')
const router = express.Router()

const User = require('../model/users')
const Classroom = require('../model/classrooms')

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

// Get Users
router.get('/', async (req, res) => {
    try {
        let result = await User.find()
        res.json({'data':result})
    } catch (error) {
        res.status(400).json({'message':error.message})
    }
})

// Create User
router.post('/', async (req, res) => {
    try {

        if(!req.body.username || !req.body.email || !req.body.password) 
        return res.status(400).json({'message':'usename , email and password is required.'})

        let checkUniqueEmail = await User.findOne({ email: req.body.email })
        if (checkUniqueEmail) return res.status(400).json({'message':'Email is already exists.'})

        let checkUniqueUsername = await User.findOne({ username: req.body.username })
        if (checkUniqueUsername) return res.status(400).json({'message':'Username is already exists.'})

        let user = new User({
            username:req.body.username,
            email:req.body.email,
            password:req.body.password
        })

        let salt = await bcrypt.genSalt(10)
        let hash = await bcrypt.hash(user.password, salt)

        user.password = hash

        let result = await user.save()
        res.json({'data':result})

    } catch (error) {
        res.status(400).json({'message':error.message})
    }
})

// Add Classroom to User
router.post('/add-classroom',async (req,res)=>{
    let user = await User.findById(req.body.userId)
    let classroom = await Classroom.findById(req.body.classroomId)

    for(let i = 0 ; i < user.classrooms.length ; i++){
        if(req.body.classroomId === user.classrooms[i]._id.toString()){
            return res.status(400).json({'message':'This course is already registered.'})
        }
    }


    user.classrooms.push(classroom)
    let result = await user.save()

    let token = jwt.sign({
        username:req.body.username,
           userId:user._id.toString(),
           userClassroom:user.classrooms
        },process.env.JWT_PRIVATE_KEY,{expiresIn:'24h'})

   res.json({'token':token})
})

// User Login
router.post('/login',async  (req,res)=>{
    try{
        let user = await User.findOne({username:req.body.username})

        if(!user) return res.status(400).send('Invalid username.')

        let requestPassword = req.body.password
        let dbPassword = user.password

        let compareResult = await bcrypt.compare(requestPassword,dbPassword)

        if(!compareResult) return res.status(400).send('Invalid password.')

        let token = jwt.sign({
             username:req.body.username,
                userId:user._id.toString(),
                userClassroom:user.classrooms
             },process.env.JWT_PRIVATE_KEY,{expiresIn:'24h'})

        res.json({'token':token})

    }catch(error){
        res.status(400).send({'message':error.message})
    }
})

router.post('/verify',async (req,res,next)=>{
    try{

        let token = req.body.token
        let isValid = jwt.verify(token,process.env.JWT_PRIVATE_KEY)

        res.json({'data':isValid})

    }catch(error){
        res.status(400).json({'message':error.message})
    }
})

module.exports = router
