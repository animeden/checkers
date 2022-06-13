const express = require('express')
const router = express.Router()
const notification = require("../controllers/notificationController")

router.get('/getAll', notification.findAll)

router.post('/create', notification.create)

router.get('/getReceiver/:receiver', notification.findByReceiver)

router.get('/getSender/:sender&:receiver', notification.findNot)

router.get('/get/:login', notification.findById)

router.put('/update/:id', notification.update)

router.delete('/delete/:id', notification.delete)

module.exports = router