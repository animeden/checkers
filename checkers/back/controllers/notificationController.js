const db = require("../models/index")
const Notification = db.notification;
const Op = db.Sequelize.Op

exports.create = (req, res) => {
    if (!req.body.sender || !req.body.receiver){
        res.status(400).send({
            message: "content cant be empty"
        })
        return
    }

    const notification = {
        sender: req.body.sender,
        receiver: req.body.receiver,
        type: req.body.type,
        read: 'notRead',
        sendername: req.body.sendername,
        senderimage: req.body.senderimage
    }

    Notification.create(notification)
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

    Notification.findAll()
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

    Notification.findAll({where:{
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

exports.findByReceiver = (req, res) => {
    const receiver = req.params.receiver

    Notification.findAll({where:{
            receiver: receiver,
            read: 'notRead'
        }})
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving the Persons with id: "
            })
        })
}

exports.findNot = (req, res) => {
    const sender = req.params.sender
    const receiver = req.params.receiver

    Notification.findAll({where:{
            receiver: receiver,
            sender: sender,
            read: 'notRead'
        }})
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving the Persons with id: "
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

    Notification.update(modifiedBody, {
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

exports.delete = (req, res) => {
    const id = req.params.id

    Notification.destroy({
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