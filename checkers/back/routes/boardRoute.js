const express = require('express')
const router = express.Router()
const board = require("../controllers/boardController")

router.get('/getAll', board.findAll)

router.post('/create', board.create)

router.put('/update/:id', board.update)

router.put('/findByRoomStatus/:room&:status', board.findByRoomStatus)

router.delete('/delete/:id', board.delete)

module.exports = router