const express = require('express')
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express()
const port = 3000

const http = require ('http')
const server = http.createServer(app)

const db = require('./models/index')

db.sequelize.sync({alter: true});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

server.listen(port,  () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

let corsOption = {
    origin: "http://localhost:3005"
}

const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
})

/**
 * Delete a element from arr
 * @param {array} arr - array
 * @param {string} attr - attribute what value must search
 * @param {string} value - value what must be removed
 * @returns {*}
 */
function removeUser(arr, attr, value){
    let i = arr.length;
    while(i--){
        if( arr[i]
            && arr[i].hasOwnProperty(attr)
            && (arguments.length > 2 && arr[i][attr] === value ) ){

            arr.splice(i,1);

        }
    }
    return arr;
}

app.use(cors(corsOption))

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }))

const userRoutes = require('./routes/userRoute')
app.use('/user', userRoutes)

const friendRoutes = require('./routes/friendRoute')
app.use('/friend', friendRoutes)

const notificationRoutes = require('./routes/notificationRoute')
app.use('/notification', notificationRoutes)

const boardRoutes = require('./routes/boardRoute')
app.use('/board', boardRoutes)

const users = []

const Friend = db.friend

const User = db.user

const Board = db.board

const quick = []

io.on('connection', (socket) => {
    let time = 25

    console.log('Connected')

    socket.on('getUsers', async (id) => {
        let arr = []

        let arr2 = []

        await Friend.findAll({
            raw: true,
            where:{
                receiver: id,
                status: 'active'
            }})
            .then(data => {
                data.forEach(elem => {
                    arr2.push(elem.sender)
                })
            })
            .catch(err => {console.log(err)})

        await Friend.findAll({
            raw: true,
            where:{
                sender: id,
                status: 'active'
            }})
            .then(data => {
                data.forEach(elem => {
                    arr2.push(elem.receiver)
                })


            })
            .catch(err => {console.log(err)})

        for(const elem of arr2) {
            await User.findAll({
                raw: true,
                where:{
                    id: elem
                }
            }).then(data => {
                let newData = {
                    id: data[0].id,
                    name: data[0].login,
                    image: data[0].image,
                    wins: data[0].wins,
                    ratingPoints: data[0].ratingPoints,
                    status: 'offline'
                }
                arr.push(newData)
            })
        }

        for(const elem of arr){
            for(const elem2 of users){
                if(elem.name === elem2.name){
                    elem.status = 'online'
                }
            }
        }

        console.log(arr)
        socket.emit('yourFriendList', arr)
    })

    socket.on('checkIfInGame', async data => {
        let check1
        await User.findAll({
            raw: true,
            where:{
                id: data.myId
            }})
            .then(data => {
                data.forEach(elem => {
                    check1 = elem.room
                })
            })
            .catch(err => {console.log(err)})
        if(check1 !== 'noRoom'){
            socket.emit('CantJoinGame', 'You already in game')
        }
        let check2
        await User.findAll({
            raw: true,
            where:{
                id: data.senderId
            }})
            .then(data => {
                data.forEach(elem => {
                    check2 = elem.room
                })
            })
            .catch(err => {console.log(err)})
        if(check2 !== 'noRoom'){
            socket.emit('CantJoinGame', 'User already in game')
        }
        if(check1 === 'noRoom' && check2 === 'noRoom'){
            socket.emit('joinGame')
        }
    })

    socket.on('win', async name => {
        let user
        await User.findAll({
            raw: true,
            where:{
                login: name
            }})
            .then(data => {
                user = data
            })
            .catch(err => {console.log(err)})
        let num = user[0].wins
        num++
        let body = {
            wins : num,
            matches: user[0].loses + user[0].wins + 1,
            ratingPoints: ((user[0].wins + 1) * 12) - user[0].loses * 4
        }
        await User.update(body, {
            where: {login: name}
        })
            .then(data => {
               console.log(data)
            })
            .catch(err => {console.log(err)})
    })

    socket.on('lose', async name => {
        let user
        await User.findAll({
            raw: true,
            where:{
                login: name
            }})
            .then(data => {
                user = data
            })
            .catch(err => {console.log(err)})
        let num = user[0].loses
        num++
        let body = {
            loses : num,
            matches: user[0].loses + user[0].wins + 1,
            ratingPoints: user[0].wins * 12 - ((user[0].loses + 1) * 4)
        }
        await User.update(body, {
            where: {login: name}
        })
            .then(data => {
                console.log(data)
            })
            .catch(err => {console.log(err)})
    })

    socket.on('stopEnemyTimer', data => {
        let id
        users.forEach(elem => {
            if(elem.name === data.enemy){
                id = elem.socketid
            }
        })
        io.to(id).emit('enemySurrended')
        io.to(data.me).emit('surrender', data.turn)
    })

    socket.on('addToRoom', info => {
        let socId
        users.forEach( data => {
            if(data.id === info.senderId){
                socId = data.socketid
            }
        })
        let newData = {
            name: info.name,
            id: info.myId
        }
        io.to(socId).emit('join', newData)
        io.to(socId).emit('myTurn', 'black')
        socket.join(info.name)
        socket.emit('myTurn', 'white')

        timer(info.name)
    })

    socket.on('stopTimer', () => {
        time = -2
    })

    socket.on('joinToRoom', data => {
        socket.join(data)
        socket.emit('info', data)
        io.to(data).emit('openOnlineMode', data)
        let ddat = {
            room: data,
            turn: 'white'
        }
        io.to(data).emit('turn', ddat)
        io.to(data).emit('room', data)

        const board = {
            room: data,
            board: '9,1,9,1,9,1,9,1,1,9,1,9,1,9,1,9,9,1,9,1,9,1,9,1,0,9,0,9,0,9,0,9,9,0,9,0,9,0,9,0,3,9,3,9,3,9,3,9,9,3,9,3,9,3,9,3,3,9,3,9,3,9,3,9',
            status: 'active',
            turn: 'white'
        }

        Board.create(board, {raw: true})
            .then(data => {
            })
            .catch(err => {
                console.log(err)
            })

        timer(data)
    })

    function timer(data){
        const timer = setInterval(() => {
            let newData = {
                time: time,
                room: data
            }
            if (time === (-2)) {
                clearInterval(timer)
            } else {
                io.to(data).emit('newTime', newData)
                time--
            }
        }, 1000);
    }

    socket.on('vsInfo', data => {
        let me
        let meSocId
        let enemy
        let enemySocId
        users.forEach( elem => {
           if(elem.name === data.myName){
               me = {
                   name: elem.name,
                   image: elem.image
               }
               meSocId = elem.socketid
           }
           if(elem.name === data.enemyName){
               enemy = {
                   name: elem.name,
                   image: elem.image
               }
               enemySocId = elem.socketid
           }
        })
        io.to(meSocId).emit('enemyInfo', enemy)
        io.to(enemySocId).emit('enemyInfo', me)
    })

    socket.on('timer', () => {
        time = 25
    })

    socket.on('move', data => {
        io.to(data.room).emit('move', data)
    })

    socket.on('changeTurn', data => {
        let newData = {
            room: data.room,
            time: 0
        }
        let body = {
            turn: data.turn
        }
        Board.update(body, {
            where: {
                room: data.room,
                status: 'active'
            }
        })
            .then(data => {
                console.log(data)
            })
            .catch(err => {console.log(err)})
        io.to(data.room).emit('newTime', newData)
        io.to(data.room).emit('turn', data)

    })

    socket.on('updateBoard', async data => {
        let body = {
            board: data.board
        }
        await Board.update(body, {
            where: {
                room: data.room,
                status: 'active'
            }
        })
            .then(data => {
                console.log(data)
            })
            .catch(err => {console.log(err)})
    })

    socket.on('disableBoard', data => {
        let body = {
            status: 'ended'
        }
        Board.update(body, {
            where: {
                room: data,
                status: 'active'
            }
        })
            .then(data => {
                console.log(data)
            })
            .catch(err => {console.log(err)})
    })

    socket.on('stop', data => {
        if(data.turn){
            let newData = {
                turn: 'black',
                room: data.room
            }
            let body = {
                turn: 'black'
            }
            Board.update(body, {
                where: {
                    room: data.room,
                    status: 'active'
                }
            })
                .then(data => {
                    console.log(data)
                })
                .catch(err => {console.log(err)})
            io.to(data.room).emit('turn', newData)
        }
        if(!data.turn){
            let newData = {
                turn: 'white',
                room: data.room
            }
            let body = {
                turn: 'white'
            }
            Board.update(body, {
                where: {
                    room: data.room,
                    status: 'active'
                }
            })
                .then(data => {
                    console.log(data)
                })
                .catch(err => {console.log(err)})
            io.to(data.room).emit('turn', newData)
        }
        time = 25
    })

    socket.on('reconnect', async room => {
        let arr = []
        await Board.findAll({
            raw: true,
            where:{
                room: room,
                status: 'active'
            }})
            .then(data => {
                arr = data
            })
            .catch(err => {console.log(err)})
        console.log('lenght')
        console.log(arr.length)
        if(arr.length > 1){
            let body = {
                status: 'ended'
            }
            Board.update(body, {
                where: {
                    room: room,
                    status: 'active'
                }
            })
        } else if(arr.length === 1){
            socket.join(room)
            console.log(arr[0])
            let data = {
                board: arr[0].board,
                turn: arr[0].turn,
                room: room
            }
            timer(room)
            io.to(room).emit('userReconnected', data)
        }
    })

    socket.on('playerData', async data => {
        io.to(data.room).emit('newUserInfo', data)
        time = 25
    })

    socket.on('newActiveUser', (data) =>{
        let createNewUser = true
        users.forEach((elem) => {
            if(elem.name === data.name){
                io.to(elem.socketid).emit('discon')
                elem.socketid = socket.id
                createNewUser = false
                console.log(users)
                io.emit('updatedUserList', users)
            }
        })
        if(data.name && createNewUser){
            let res = {
                id: data.id,
                socketid: socket.id,
                name: data.name,
                wins: data.wins,
                image: data.image,
                loses: data.loses,
                matches: data.matches,
                ratingPoints: data.ratingPoints
            }
            users.push(res)
            console.log(users)
            io.emit('updatedUserList', users)
        }
    })

    socket.on('out', () => {
        socket.disconnect()
    })

    socket.on('newImage', (data) => {
        users.forEach((elem) => {
            if(elem.name === data.name){
                elem.image = data.image
                io.emit('updatedUserList', users)
            }
        })
    })

    socket.on('newUserName', (data) => {
        users.forEach((elem) => {
            if(elem.name === data.name){
                elem.name = data.newName
                io.emit('updatedUserList', users)
            }
        })
    })

    socket.on('check', (data) => {
        let arr = []
        users.forEach(elem => {
            data.forEach( dataelem => {
                if(elem.name === dataelem.login){
                    arr.push(elem)
                }
            })
        })
        socket.emit('checkSucc', arr)
    })

    socket.on('quickGame', data => {
        let next = true
        quick.forEach(elem => {
            if(elem.name === data){
                next = false
            }
        })
        users.forEach(elem => {
            if (elem.name === data && next) {
                quick.push(elem)
            }
        })
        if(quick.length >= 2){
            io.to(quick[0].socketid).emit('quickGameFind', quick[1].id)
            let data0 = quick[0].id
            let data1 = quick[1].id
            removeUser(quick, 'id', data0)
            removeUser(quick, 'id', data1)
        }
    })

    socket.on('notification', data => {
        io.to(data).emit('notification')
    })

    socket.on('disconnect', () => {
        time = -2
        console.log('Disconnected')
        removeUser(users, 'socketid', socket.id)
        removeUser(quick, 'socketid', socket.id)
        console.log(users)
        io.emit('updatedUserList', users)
        io.emit('hideButtons', socket.id)
        users.forEach(elem => {
            if(elem.socketid === socket.id){
                io.emit('hideButtons2', elem.name)
            }
        })
    })
})
