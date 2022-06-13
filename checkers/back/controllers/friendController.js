const db = require("../models/index")
const Friend = db.friend;
const Op = db.Sequelize.Op

exports.create = (req, res) => {
    if (!req.body.sender || !req.body.receiver){
        res.status(400).send({
            message: "content cant be empty"
        })
        return
    }

    const friend = {
        sender: req.body.sender,
        receiver: req.body.receiver,
        status: 'inProcess',
    }

    Friend.create(friend)
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

    Friend.findAll()
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

exports.findById = (req, res) => {

    const id = req.params.id

    Friend.findAll({where:{
            id: id
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

exports.findIfActive = (req, res) => {
    const receiver = req.params.receiver
    const sender = req.params.sender
    const status = req.params.status

    Friend.findAll({where:{
            sender: sender,
            receiver: receiver,
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

exports.findByReceiver = (req, res) => {
    const receiver = req.params.receiver

    Friend.findAll({where:{
            receiver: receiver,
            status: 'active'
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

exports.findBySender = (req, res) => {
    const sender = req.params.sender

    Friend.findAll({where:{
            sender: sender,
            status: 'active'
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
    const id = req.params.id
    let modifiedBody = {}

    for (const [key, value] of Object.entries(req.body)) {
        if (value){
            modifiedBody[key]=value
        }
    }

    Friend.update(modifiedBody, {
        where: {id: id}
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

exports.updateBySenderAndReceiver = (req, res) => {
    const sender = req.params.sender
    const receiver = req.params.receiver
    const status = req.params.status
    let modifiedBody = {}

    for (const [key, value] of Object.entries(req.body)) {
        if (value){
            modifiedBody[key]=value
        }
    }

    Friend.update(modifiedBody, {
        where: {sender: sender,
            receiver: receiver,
        status: status}
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

    Friend.destroy({
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