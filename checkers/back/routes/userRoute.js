const express = require('express')
const router = express.Router()
const users = require("../controllers/userController")

router.get('/getAll/:login', users.findAll)

router.post('/create', users.create)

router.get('/getId/:id', users.findByIdFr)

router.get('/get/:login', users.findById)

router.put('/update/:id', users.update)

router.delete('/delete/:id', users.delete)

router.get('/login:login&:password', users.login)

router.get('/rating', users.rating)

module.exports = router