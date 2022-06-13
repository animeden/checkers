const db = require("../models/index")
const Board = db.board;
const Op = db.Sequelize.Op

exports.create = (req, res) => {
    if (!req.body.sender || !req.body.receiver){
        res.status(400).send({
            message: "content cant be empty"
        })
        return
    }

    const board = {
        room: req.body.room,
        board: req.body.board,
        status: 'active',
        turn: 'white'
    }

    Board.create(board)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Person"
            })
        })
}

exports.findAll = (req, res) => {

    Board.findAll()
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving the Persons"
            })
        })
}

exports.findByRoomStatus = (req, res) => {
    const room = req.params.room
    const status = req.params.status

    Board.findAll({where:{
            room: room,
            status: status
        }})
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving the Persons with id: " + id
            })
        })
}

exports.update = (req, res) => {
    const room = req.params.room
    let modifiedBody = {}

    for (const [key, value] of Object.entries(req.body)) {
        if (value){
            modifiedBody[key]=value
        }
    }

    Board.update(modifiedBody, {
        where: {room: room}
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while updating the Persons with ID: " + id
            })
        })
}

exports.delete = (req, res) => {
    const id = req.params.id

    Board.destroy({
        where: {id: id}
    })
        .then(num => {
            (num === 1) ? res.send('Success') : res.send('Invalid data')
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting the Persons with ID: " + id
            })
        })
}