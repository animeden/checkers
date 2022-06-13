const db = require("../models/index")
const User = db.user;
const Op = db.Sequelize.Op

exports.create = (req, res) => {
    if (!req.body.login || !req.body.password){
        res.status(400).send({
            message: "content cant be empty"
        })
        return
    }

    const user = {
        login: req.body.login,
        password: req.body.password,
        wins: 0,
        image: 'default.png',
        room: '',
        loses: 0,
        matches: 0,
        ratingPoints: 0
    }

    User.create(user)
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

    const login = req.params.login

    User.findAll({ where: {
        login : {
            [Op.substring]: login
        }
    }
    })
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

    const login = req.params.login

    User.findAll({where:{
        login: login
    }})
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving the Persons with name: " + login
            })
        })
}

exports.finA = (req, res) => {

    User.findAll()
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

exports.findByIdFr = (req, res) => {

    const id = req.params.id

    User.findAll({where:{
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

exports.login = (req, res) =>{

    const login = req.params.login
    const password = req.params.password

    User.findAll({where:{
            login: login,
            password: password
        }})
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while login: " + login
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

    User.update(modifiedBody, {
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

    User.destroy({
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

exports.rating = (req, res) => {

    User.findAll({
        order: [
            ['ratingPoints', 'DESC']
        ]
    })
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