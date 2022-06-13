const express = require('express')
const router = express.Router()
const friend = require("../controllers/friendController")

router.get('/getAll', friend.findAll)

router.post('/create', friend.create)

router.get('/getReceiver/:receiver', friend.findByReceiver)

router.get('/getSender/:sender', friend.findBySender)

router.get('/get/:login', friend.findById)

router.put('/update/:id', friend.update)

router.put('/acceptOrDelete/:sender&:receiver&:status', friend.updateBySenderAndReceiver)

router.delete('/delete/:id', friend.delete)

router.get('/ifExist:sender&:receiver&:status', friend.findIfActive)

module.exports = router