import React, {useState, useEffect} from 'react';
import '../index.css'
import {useDispatch, useSelector} from 'react-redux'
import CellOnline from "./cellOnline";
import {socket} from "../socket";
import {setLogin, setRoom} from "../redux/actions";
import axios from "axios";
import stringify from "qs-stringify";

function GameOnline(){

    const myId  =  useSelector(state => state.login.stateUserId);

    const name  =  useSelector(state => state.login.stateUserName);

    const image  =  useSelector(state => state.login.stateUserImage);

    const wins = useSelector(state => state.login.stateUserWins);

    const loses = useSelector(state => state.login.stateUserLoses);

    const matches = useSelector(state => state.login.stateUserMatches);

    const [enemyName, setEnemyName] = useState('unknow')

    const [enemyImg, setEnemyImg] = useState('default.png')

    const [white, setWhite] = useState('')

    const [black, setBlack] = useState('')

    const [whiteWin, setWhiteWin] = useState(false)

    const [blackWin, setBlackWin] = useState(false)

    const dispatch = useDispatch();

    let activeCell

    const [turn2, setTurn] = useState(true)

    let turn = true

    let moves = false

    const [myTurn, setMyTurn] = useState(false)

    const [timer, setTimer] = useState(0)

    const board =[
        9, 1, 9, 1, 9, 1, 9, 1,
        1, 9, 1, 9, 1, 9, 1, 9,
        9, 1, 9, 1, 9, 1, 9, 1,
        0, 9, 0, 9, 0, 9, 0, 9,
        9, 0, 9, 0, 9, 0, 9, 0,
        3, 9, 3, 9, 3, 9, 3, 9,
        9, 3, 9, 3, 9, 3, 9, 3,
        3, 9, 3, 9, 3, 9, 3, 9
    ]

    let r = 0
    let arr = []
    let id = 64

    useEffect(() => {
        whiteAndBlack()
    }, [turn2])

    /**
     * Count how many black and white checkers left
     */
    function whiteAndBlack(){
        let ct = document.querySelectorAll('.selectCellOnHidden')
        ct.forEach(elem => {
            elem.className = 'emptyCellOn'
        })
        let num
        num = 0
        let wh = document.querySelectorAll('.whiteCellOn')
        wh.forEach(elem => {
            num++
        })
        setWhite(String(num))
        if(num === 0){
            setBlackWin(true)
            if(!myTurn){
                socket.emit('win', name)
                socket.emit('disableBoard', enemyName)
                socket.emit('lose', enemyName)
                let num = Number(wins)
                num++
                let num2 = Number(matches)
                num2++
                let string = String(num)
                let string2 = String(num2)
                dispatch(setLogin({id: myId, name: name, wins: string, image: image, matches: string2, loses: loses}));
            }
            if(myTurn){
                let num = Number(loses)
                num++
                let num2 = Number(matches)
                num2++
                let string = String(num)
                let string2 = String(num2)
                dispatch(setLogin({id: myId, name: name, wins: wins, image: image, matches: string2, loses: string}));
                socket.emit('disableBoard', name)
            }
            socket.emit('stopTimer')
        }
        num = 0
        let bl = document.querySelectorAll('.blackCellOn')
        bl.forEach(elem => {
            num++
        })
        setBlack(String(num))
        if(num === 0){
            setWhiteWin(true)
            if(myTurn){
                socket.emit('win', name)
                socket.emit('disableBoard', name)
                socket.emit('lose', enemyName)
                let num = Number(wins)
                num++
                let num2 = Number(matches)
                num2++
                let string = String(num)
                let string2 = String(num2)
                dispatch(setLogin({id: myId, name: name, wins: string, image: image, matches: string2, loses: loses}));
            }
            if(!myTurn){
                let num = Number(loses)
                num++
                let num2 = Number(matches)
                num2++
                let string = String(num)
                let string2 = String(num2)
                dispatch(setLogin({id: myId, name: name, wins: wins, image: image, matches: string2, loses: string}));
                socket.emit('disableBoard', enemyName)
            }
            socket.emit('stopTimer')
        }
    }

    /**
     * Send a surrender data
     */
    async function surrender(){
        socket.emit('stopTimer')
        let data
        if(myTurn) {
            data = {
                enemy: enemyName,
                me: name,
                turn: myTurn
            }
        }
        if(!myTurn) {
            data = {
                enemy: enemyName,
                me: enemyName,
                turn: myTurn
            }
        }
        socket.emit('stopEnemyTimer', data)
    }

    /**
     * Reload a window
     */
    async function restart(){
        await updateRoom('noRoom')
        socket.emit('stopTimer')
        window.location.reload()
    }

    let next = true

    /**
     * Write to DataBase a room
     * @param {string} room - a room name
     */
    async function updateRoom(room){
        await axios({
            method: "put",
            url: "http://localhost:3000/user/update/" + myId,
            data: stringify({
                room: room
            })
        }).then(function (response) {
            if (response.data !== '') {
                dispatch(setRoom(room))
            }
        }).catch(function (error) {

        });
    }

    useEffect(() => {
        socket.on('move', data => {
            cl2(data.elem, data.room)
            setRoom(data.room)
        })

        socket.on('turn', data => {
            let ct = document.querySelectorAll('.selectCellOn')
            ct.forEach(elem => {
                elem.className = 'emptyCellOn'
            })
            if(String(data.turn) === 'white'){
                turn = true
            }
            if(String(data.turn) === 'black'){
                turn = false
            }
            setTurn(turn)
            setRoom(data.room)
        })

        socket.on('surrender', data => {
            if(data){
                let arr = document.querySelectorAll('.whiteCellOn')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'whiteCellOn whiteKingOn'){
                        document.getElementById(cell.id).className = 'white whiteQueen'
                    } else document.getElementById(cell.id).className = 'white'
                })
                setTurn(!turn)
            }
            if(!data){
                let arr = document.querySelectorAll('.blackCellOn')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'blackCellOn blackKingOn'){
                        document.getElementById(cell.id).className = 'black blackQueen'
                    } else document.getElementById(cell.id).className = 'black'
                })
                setTurn(!turn)
            }
        })

        socket.on('myTurn', data => {
            if(data === 'white'){
                setMyTurn(true)
                moves = true
            }
            if(data === 'black'){
                setMyTurn(false)
                moves = false
            }
        })

        socket.on('enemyInfo', data => {
            setEnemyImg(data.image)
            setEnemyName(data.name)
            socket.emit('timer')
        })

        socket.on('openOnlineMode', data => {
            socket.emit('startTimer', data)
        })

        socket.on('userReconnected', data => {
            let newData = {
                name: name,
                image: image,
                room: data.room
            }
            socket.emit('playerData', newData)
            if (data.room === name){
                setMyTurn(true)
                moves = true
            } else {
                setMyTurn(false)
                moves = false
            }
            if (data.turn === 'white') {
                setTurn(true)
                turn = true
            }
            if (data.turn === 'black') {
                setTurn(false)
                turn = false
            }
            let idBoard = 64
            let newBoard = data.board
            let splitedBoard = newBoard.split(',')
            let newBoardMassive = []
            splitedBoard.forEach( elem => {
                newBoardMassive.push(Number(elem))
            })
            newBoardMassive.forEach(elem => {
                if(elem === 9){
                    document.getElementById(idBoard).className = 'notCellOn'
                } else
                if(elem === 1){
                    document.getElementById(idBoard).className = 'whiteCellOn'
                } else
                if(elem === 2){
                    document.getElementById(idBoard).className = 'whiteCellOn whiteKingOn'
                } else
                if(elem === 3){
                    document.getElementById(idBoard).className = 'blackCellOn'
                } else
                if(elem === 4){
                    document.getElementById(idBoard).className = 'blackCellOn blackKingOn'
                } else
                if(elem === 0){
                    document.getElementById(idBoard).className = 'emptyCellOn'
                }
                idBoard++
            })
        })

        socket.on('newUserInfo', data => {
            if(data.name !== name) {
                setEnemyImg(data.image)
                setEnemyName(data.name)
            }
        })

        socket.on('newTime', data => {
            if(data.time === 0){
                let newData = {
                    room: data.room,
                    turn: turn
                }
                let arr = document.querySelectorAll('.white')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'white whiteQueen'){
                        document.getElementById(cell.id).className = 'whiteCellOn whiteKingOn'
                    } else document.getElementById(cell.id).className = 'whiteCellOn'
                })
                let arr2 = document.querySelectorAll('.black')
                arr2.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'black blackQueen'){
                        document.getElementById(cell.id).className = 'blackCellOn blackKingOn'
                    } else document.getElementById(cell.id).className = 'blackCellOn'
                })
                socket.emit('stop', newData)
            }
            setTimer(data.time)
        })

        socket.on('test', data => {
            console.log(data)
        })

        socket.on('enemySurrended', () => {
            socket.emit('stopTimer')
        })
    }, [])

    /**
     * Move logic for each checker
     * @param {string} elem - id of clicked elem
     * @param {string} room - name of your room
     */
    function cl2(elem, room) {

        //white cell logic
        if(document.getElementById(elem).className === 'whiteCellOn') {
            let ct = document.querySelectorAll('.selectCellOn')
            ct.forEach(elem => {
                elem.className = 'emptyCellOn'
            })
            activeCell = elem
            let num = Number(elem)
            num = num + 7
            if(num > 127){
                num = 127
            }
            if(document.getElementById(String(num)).className === 'emptyCellOn') {
                if(moves) {
                    document.getElementById(String(num)).className = 'selectCellOn'
                }else{
                    document.getElementById(String(num)).className = 'selectCellOnHidden'
                }
            }
            if(document.getElementById(String(num)).className === 'blackCellOn' || document.getElementById(String(num)).className === 'blackCellOn blackKingOn'){
                let r = num + 7
                if(r > 127){
                    r = 127
                }
                if(document.getElementById(String(r)).className === 'emptyCellOn'){
                    if(moves) {
                        document.getElementById(String(r)).className = 'selectCellOn'
                    }else{
                        document.getElementById(String(r)).className = 'selectCellOnHidden'
                    }
                }
            }
            num = num + 2
            if(num > 127){
                num = 127
            }
            if(document.getElementById(String(num)).className === 'emptyCellOn') {
                if(moves) {
                    document.getElementById(String(num)).className = 'selectCellOn'
                }else{
                    document.getElementById(String(num)).className = 'selectCellOnHidden'
                }
            }
            if(document.getElementById(String(num)).className === 'blackCellOn' || document.getElementById(String(num)).className === 'blackCellOn blackKingOn'){
                let r = num + 9
                if(r > 127){
                    r = 127
                }
                if(document.getElementById(String(r)).className === 'emptyCellOn'){
                    if(moves) {
                        document.getElementById(String(r)).className = 'selectCellOn'
                    }else{
                        document.getElementById(String(r)).className = 'selectCellOnHidden'
                    }
                }
            }
        }

        //white king logic
        else if(document.getElementById(elem).className === 'whiteCellOn whiteKingOn'){
            let ct = document.querySelectorAll('.selectCellOn')
            ct.forEach(elem => {
                elem.className = 'emptyCellOn'
            })
            activeCell = elem
            let num = Number(elem)
            num = num - 7
            if (num < 64) {
                num = 64
            }
            if(document.getElementById(String(num)).className === 'emptyCellOn') {
                if(moves) {
                    document.getElementById(String(num)).className = 'selectCellOn'
                }else{
                    document.getElementById(String(num)).className = 'selectCellOnHidden'
                }
            }
            if(document.getElementById(String(num)).className === 'blackCellOn' || document.getElementById(String(num)).className === 'blackCellOn blackKingOn'){
                let r = num - 7
                if(r < 64){
                    r = 64
                }
                if(document.getElementById(String(r)).className === 'emptyCellOn'){
                    if(moves) {
                        document.getElementById(String(r)).className = 'selectCellOn'
                    }else{
                        document.getElementById(String(r)).className = 'selectCellOnHidden'
                    }
                }
            }
            num = Number(elem)
            num = num - 9
            if (num < 64) {
                num = 64
            }
            if(document.getElementById(String(num)).className === 'emptyCellOn') {
                if(moves) {
                    document.getElementById(String(num)).className = 'selectCellOn'
                }else{
                    document.getElementById(String(num)).className = 'selectCellOnHidden'
                }
            }
            if(document.getElementById(String(num)).className === 'blackCellOn' || document.getElementById(String(num)).className === 'blackCellOn blackKingOn'){
                let r = num - 9
                if(r < 64){
                    r = 64
                }
                if(document.getElementById(String(r)).className === 'emptyCellOn'){
                    if(moves) {
                        document.getElementById(String(r)).className = 'selectCellOn'
                    }else{
                        document.getElementById(String(r)).className = 'selectCellOnHidden'
                    }
                }
            }
            num = Number(elem)
            num = num + 7
            if (num > 127) {
                num = 127
            }
            if(document.getElementById(String(num)).className === 'emptyCellOn') {
                if(moves) {
                    document.getElementById(String(num)).className = 'selectCellOn'
                }else{
                    document.getElementById(String(num)).className = 'selectCellOnHidden'
                }
            }
            if(document.getElementById(String(num)).className === 'blackCellOn' || document.getElementById(String(num)).className === 'blackCellOn blackKingOn'){
                let r = num + 7
                if(r > 127){
                    r = 127
                }
                if(document.getElementById(String(r)).className === 'emptyCellOn'){
                    if(moves) {
                        document.getElementById(String(r)).className = 'selectCellOn'
                    }else{
                        document.getElementById(String(r)).className = 'selectCellOnHidden'
                    }
                }
            }
            num = Number(elem)
            num = num + 9
            if (num > 127) {
                num = 127
            }
            if(document.getElementById(String(num)).className === 'emptyCellOn') {
                if(moves) {
                    document.getElementById(String(num)).className = 'selectCellOn'
                }else{
                    document.getElementById(String(num)).className = 'selectCellOnHidden'
                }
            }
            if(document.getElementById(String(num)).className === 'blackCellOn' || document.getElementById(String(num)).className === 'blackCellOn blackKingOn'){
                let r = num + 9
                if(r > 127){
                    r = 127
                }
                if(document.getElementById(String(r)).className === 'emptyCellOn'){
                    if(moves) {
                        document.getElementById(String(r)).className = 'selectCellOn'
                    }else{
                        document.getElementById(String(r)).className = 'selectCellOnHidden'
                    }
                }
            }
        }

        //black cell logic
        else if(document.getElementById(elem).className === 'blackCellOn'){
            let ct = document.querySelectorAll('.selectCellOn')
            ct.forEach(elem => {
                elem.className = 'emptyCellOn'
            })
            activeCell = elem
            let num = Number(elem)
            num = num - 7
            if(num < 64){
                num = 64
            }
            if(document.getElementById(String(num)).className === 'emptyCellOn') {
                if(!moves) {
                    document.getElementById(String(num)).className = 'selectCellOn'
                }else{
                    document.getElementById(String(num)).className = 'selectCellOnHidden'
                }
            }
            if(document.getElementById(String(num)).className === 'whiteCellOn' || document.getElementById(String(num)).className === 'whiteCellOn whiteKingOn'){
                let r = num - 7
                if(r < 64){
                    r = 64
                }
                if(document.getElementById(String(r)).className === 'emptyCellOn'){
                    if(!moves) {
                        document.getElementById(String(r)).className = 'selectCellOn'
                    }else{
                        document.getElementById(String(r)).className = 'selectCellOnHidden'
                    }
                }
            }
            num = num - 2
            if(num < 64){
                num = 64
            }
            if(document.getElementById(String(num)).className === 'emptyCellOn') {
                if(!moves) {
                    document.getElementById(String(num)).className = 'selectCellOn'
                }else{
                    document.getElementById(String(num)).className = 'selectCellOnHidden'
                }
            }
            if(document.getElementById(String(num)).className === 'whiteCellOn' || document.getElementById(String(num)).className === 'whiteCellOn whiteKingOn'){
                let r = num - 9
                if(r < 64){
                    r = 64
                }
                if(document.getElementById(String(r)).className === 'emptyCellOn'){
                    if(!moves) {
                        document.getElementById(String(r)).className = 'selectCellOn'
                    }else{
                        document.getElementById(String(r)).className = 'selectCellOnHidden'
                    }
                }
            }
        }

        //black king logic
        else if(document.getElementById(elem).className === 'blackCellOn blackKingOn'){
            let ct = document.querySelectorAll('.selectCellOn')
            ct.forEach(elem => {
                elem.className = 'emptyCellOn'
            })
            activeCell = elem
            let num = Number(elem)
            num = num - 7
            if (num < 64) {
                num = 64
            }
            if(document.getElementById(String(num)).className === 'emptyCellOn') {
                if(!moves) {
                    document.getElementById(String(num)).className = 'selectCellOn'
                }else{
                    document.getElementById(String(num)).className = 'selectCellOnHidden'
                }
            }
            if(document.getElementById(String(num)).className === 'whiteCellOn' || document.getElementById(String(num)).className === 'whiteCellOn whiteKingOn'){
                let r = num - 7
                if(r < 64){
                    r = 64
                }
                if(document.getElementById(String(r)).className === 'emptyCellOn'){
                    if(!moves) {
                        document.getElementById(String(r)).className = 'selectCellOn'
                    }else{
                        document.getElementById(String(r)).className = 'selectCellOnHidden'
                    }
                }
            }
            num = Number(elem)
            num = num - 9
            if (num < 64) {
                num = 64
            }
            if(document.getElementById(String(num)).className === 'emptyCellOn') {
                if(!moves) {
                    document.getElementById(String(num)).className = 'selectCellOn'
                }else{
                    document.getElementById(String(num)).className = 'selectCellOnHidden'
                }
            }
            if(document.getElementById(String(num)).className === 'whiteCellOn' || document.getElementById(String(num)).className === 'whiteCellOn whiteKingOn'){
                let r = num - 9
                if(r < 64){
                    r = 64
                }
                if(document.getElementById(String(r)).className === 'emptyCellOn'){
                    if(!moves) {
                        document.getElementById(String(r)).className = 'selectCellOn'
                    }else{
                        document.getElementById(String(r)).className = 'selectCellOnHidden'
                    }
                }
            }
            num = Number(elem)
            num = num + 7
            if (num > 127) {
                num = 127
            }
            if(document.getElementById(String(num)).className === 'emptyCellOn') {
                if(!moves) {
                    document.getElementById(String(num)).className = 'selectCellOn'
                }else{
                    document.getElementById(String(num)).className = 'selectCellOnHidden'
                }
            }
            if(document.getElementById(String(num)).className === 'whiteCellOn' || document.getElementById(String(num)).className === 'whiteCellOn whiteKingOn'){
                let r = num + 7
                if(r > 127){
                    r = 127
                }
                if(document.getElementById(String(r)).className === 'emptyCellOn'){
                    if(!moves) {
                        document.getElementById(String(r)).className = 'selectCellOn'
                    }else{
                        document.getElementById(String(r)).className = 'selectCellOnHidden'
                    }
                }
            }
            num = Number(elem)
            num = num + 9
            if (num > 127) {
                num = 127
            }
            if(document.getElementById(String(num)).className === 'emptyCellOn') {
                if(!moves) {
                    document.getElementById(String(num)).className = 'selectCellOn'
                }else{
                    document.getElementById(String(num)).className = 'selectCellOnHidden'
                }
            }
            if(document.getElementById(String(num)).className === 'whiteCellOn' || document.getElementById(String(num)).className === 'whiteCellOn whiteKingOn'){
                let r = num + 9
                if(r > 127){
                    r = 127
                }
                if(document.getElementById(String(r)).className === 'emptyCellOn'){
                    if(!moves) {
                        document.getElementById(String(r)).className = 'selectCellOn'
                    }else{
                        document.getElementById(String(r)).className = 'selectCellOnHidden'
                    }
                }
            }
        }

        //selected cell on click logic
        else if(document.getElementById(elem).className === 'selectCellOn' || document.getElementById(elem).className === 'selectCellOnHidden') {
            let ct = document.querySelectorAll('.selectCellOn')
            ct.forEach(elem => {
                elem.className = 'emptyCellOn'
            })
            if (document.getElementById(activeCell).className === 'whiteCellOn' || document.getElementById(activeCell).className === 'white') {
                document.getElementById(activeCell).className = 'emptyCellOn'
                document.getElementById(elem).className = 'whiteCellOn'
                let num = Number(activeCell)
                num = num + 14
                if (num > 127) {
                    num = 127
                }
                if (num === elem) {
                    let r = num - 7
                    if (r < 64) {
                        r = 64
                    }
                    if (document.getElementById(String(r)).className === 'blackCellOn' || document.getElementById(String(r)).className === 'blackCellOn blackKingOn') {
                        document.getElementById(String(r)).className = 'emptyCellOn'
                        next = false
                        again(elem)
                    }
                }
                num = Number(activeCell)
                num = num + 18
                if (num > 127) {
                    num = 127
                }
                if (num === elem) {
                    let r = num - 9
                    if (r < 64) {
                        r = 64
                    }
                    if (document.getElementById(String(r)).className === 'blackCellOn' || document.getElementById(String(r)).className === 'blackCellOn blackKingOn') {
                        document.getElementById(String(r)).className = 'emptyCellOn'
                        next = false
                        again(elem)
                    }
                }
            }
            if (document.getElementById(activeCell).className === 'whiteCellOn whiteKingOn' || document.getElementById(activeCell).className === 'white whiteQueen') {
                document.getElementById(activeCell).className = 'emptyCellOn'
                document.getElementById(elem).className = 'whiteCellOn whiteKingOn'
                let num = Number(activeCell)
                num = num + 14
                if (num > 127) {
                    num = 127
                }
                if (num === elem) {
                    let r = num - 7
                    if (r < 64) {
                        r = 64
                    }
                    if (document.getElementById(String(r)).className === 'blackCellOn' || document.getElementById(String(r)).className === 'blackCellOn blackKingOn') {
                        document.getElementById(String(r)).className = 'emptyCellOn'
                        next = false
                        again(elem)
                    }
                }
                num = Number(activeCell)
                num = num + 18
                if (num > 127) {
                    num = 127
                }
                if (num === elem) {
                    let r = num - 9
                    if (r < 64) {
                        r = 64
                    }
                    if (document.getElementById(String(r)).className === 'blackCellOn' || document.getElementById(String(r)).className === 'blackCellOn blackKingOn') {
                        document.getElementById(String(r)).className = 'emptyCellOn'
                        next = false
                        again(elem)
                    }
                }
                num = Number(activeCell)
                num = num - 14
                if (num < 64) {
                    num = 64
                }
                if (num === elem) {
                    let r = num + 7
                    if (r > 127) {
                        r = 127
                    }
                    if (document.getElementById(String(r)).className === 'blackCellOn' || document.getElementById(String(r)).className === 'blackCellOn blackKingOn') {
                        document.getElementById(String(r)).className = 'emptyCellOn'
                        next = false
                        again(elem)
                    }
                }
                num = Number(activeCell)
                num = num - 18
                if (num < 64) {
                    num = 64
                }
                if (num === elem) {
                    let r = num + 9
                    if (r > 127) {
                        r = 127
                    }
                    if (document.getElementById(String(r)).className === 'blackCellOn' || document.getElementById(String(r)).className === 'blackCellOn blackKingOn') {
                        document.getElementById(String(r)).className = 'emptyCellOn'
                        next = false
                        again(elem)
                    }
                }
            }

            if ((elem === 120 || elem === 122 || elem === 124 || elem === 126) && document.getElementById(elem).className === 'whiteCellOn') {
                document.getElementById(elem).className += ' whiteKingOn'
            }
            if (document.getElementById(activeCell).className === 'blackCellOn' || document.getElementById(activeCell).className === 'black') {
                document.getElementById(activeCell).className = 'emptyCellOn'
                document.getElementById(elem).className = 'blackCellOn'
                let num = Number(activeCell)
                num = num - 14
                if (num === elem) {
                    let r = num + 7
                    if (document.getElementById(String(r)).className === 'whiteCellOn' || document.getElementById(String(r)).className === 'whiteCellOn whiteKingOn') {
                        document.getElementById(String(r)).className = 'emptyCellOn'
                        next = false
                        again(elem)
                    }
                }
                num = num - 4
                if (num === elem) {
                    let r = num + 9
                    if (document.getElementById(String(r)).className === 'whiteCellOn' || document.getElementById(String(r)).className === 'whiteCellOn whiteKingOn') {
                        document.getElementById(String(r)).className = 'emptyCellOn'
                        next = false
                        again(elem)
                    }
                }
            }
            if (document.getElementById(activeCell).className === 'blackCellOn blackKingOn' || document.getElementById(activeCell).className === 'black blackQueen') {
                document.getElementById(activeCell).className = 'emptyCellOn'
                document.getElementById(elem).className = 'blackCellOn blackKingOn'
                let num = Number(activeCell)
                num = num - 14
                if (num === elem) {
                    let r = num + 7
                    if (document.getElementById(String(r)).className === 'whiteCellOn' || document.getElementById(String(r)).className === 'whiteCellOn whiteKingOn') {
                        document.getElementById(String(r)).className = 'emptyCellOn'
                        next = false
                        again(elem)
                    }
                }
                num = num - 4
                if (num === elem) {
                    let r = num + 9
                    if (document.getElementById(String(r)).className === 'whiteCellOn' || document.getElementById(String(r)).className === 'whiteCellOn whiteKingOn') {
                        document.getElementById(String(r)).className = 'emptyCellOn'
                        next = false
                        again(elem)
                    }
                }
                num = Number(activeCell)
                num = num + 14
                if (num === elem) {
                    let r = num - 7
                    if (document.getElementById(String(r)).className === 'whiteCellOn' || document.getElementById(String(r)).className === 'whiteCellOn whiteKingOn') {
                        document.getElementById(String(r)).className = 'emptyCellOn'
                        next = false
                        again(elem)
                    }
                }
                num = num + 4
                if (num === elem) {
                    let r = num - 9
                    if (document.getElementById(String(r)).className === 'whiteCellOn' || document.getElementById(String(r)).className === 'whiteCellOn whiteKingOn') {
                        document.getElementById(String(r)).className = 'emptyCellOn'
                        next = false
                        again(elem)
                    }
                }
            }
            if ((elem === 65 || elem === 67 || elem === 69 || elem === 71) && document.getElementById(elem).className === 'blackCellOn') {
                document.getElementById(elem).className += ' blackKingOn'
            }
            if (next && (moves === turn)) {
                let massive = []
                for(let i = 64; i < 128; i++){
                    if(document.getElementById(i).className === 'notCellOn'){
                        massive.push(9)
                    } else
                    if(document.getElementById(i).className === 'whiteCellOn'){
                        massive.push(1)
                    } else
                    if(document.getElementById(i).className === 'whiteCellOn whiteKingOn'){
                        massive.push(2)
                    } else
                    if(document.getElementById(i).className === 'blackCellOn'){
                        massive.push(3)
                    } else
                    if(document.getElementById(i).className === 'blackCellOn blackKingOn'){
                        massive.push(4)
                    } else
                    if(document.getElementById(i).className === 'emptyCellOn'){
                        massive.push(0)
                    }
                }
                let newBoard = String(massive)
                let newData = {
                    room: room,
                    board: newBoard
                }
                socket.emit('updateBoard', newData)
                if(turn === true){
                    let data = {
                        room: room,
                        turn: 'black'
                    }
                    socket.emit('changeTurn', data)
                }
                else if(turn === false){
                    let data = {
                        room: room,
                        turn: 'white'
                    }
                    socket.emit('changeTurn', data)
                }
            }

        }
    }

    /**
     * Look if checker can move
     * @param {string} element - element id
     */
    function again(elem) {
        let ct = document.querySelectorAll('.selectCellOn')
        ct.forEach(elem => {
            elem.className = 'emptyCellOn'
        })
        activeCell = elem

        //white logic
        if (document.getElementById(elem).className === 'whiteCellOn') {
            let ct = document.querySelectorAll('.selectCellOn')
            ct.forEach(elem => {
                elem.className = 'emptyCellOn'
            })
            activeCell = elem
            let num = Number(elem)
            num = num + 7
            if (num > 127) {
                num = 127
            }
            if (document.getElementById(String(num)).className === 'emptyCellOn' || document.getElementById(String(num)).className === 'whiteCellOn' || document.getElementById(String(num)).className === 'blackCellOn' || document.getElementById(String(num)).className === 'notCellOn' || document.getElementById(String(num)).className === 'blackCellOn blackKingOn' || document.getElementById(String(num)).className === 'whiteCellOn whiteKingOn') {
                next = true
                let arr = document.querySelectorAll('.white')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'white whiteQueen'){
                        document.getElementById(cell.id).className = 'whiteCellOn whiteKingOn'
                    } else document.getElementById(cell.id).className = 'whiteCellOn'
                })
            }
            num = Number(elem)
            num = num + 9
            if (num > 127) {
                num = 127
            }
            if (document.getElementById(String(num)).className === 'emptyCellOn' || document.getElementById(String(num)).className === 'whiteCellOn' || document.getElementById(String(num)).className === 'blackCellOn' || document.getElementById(String(num)).className === 'notCellOn' || document.getElementById(String(num)).className === 'blackCellOn blackKingOn' || document.getElementById(String(num)).className === 'whiteCellOn whiteKingOn') {
                next = true
                let arr = document.querySelectorAll('.white')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'white whiteQueen'){
                        document.getElementById(cell.id).className = 'whiteCellOn whiteKingOn'
                    } else document.getElementById(cell.id).className = 'whiteCellOn'
                })
            }
            num = Number(elem)
            num = num + 7
            if (num > 127) {
                num = 127
            }
            if (document.getElementById(String(num)).className === 'blackCellOn' || document.getElementById(String(num)).className === 'blackCellOn blackKingOn') {
                let r = num + 7
                if (r > 127) {
                    r = 127
                }
                if (document.getElementById(String(r)).className === 'emptyCellOn') {
                    if(moves) {
                        document.getElementById(String(r)).className = 'selectCellOn'
                    }else{
                        document.getElementById(String(r)).className = 'selectCellOnHidden'
                    }
                    next = false
                    let arr = document.querySelectorAll('.whiteCellOn')
                    arr.forEach(cell => {
                        if(document.getElementById(cell.id).className === 'whiteCellOn whiteKingOn'){
                            document.getElementById(cell.id).className = 'white whiteQueen'
                        } else document.getElementById(cell.id).className = 'white'
                    })
                }
            }
            num = Number(elem)
            num = num + 9
            if (num > 127) {
                num = 127
            }
            if (document.getElementById(String(num)).className === 'blackCellOn' || document.getElementById(String(num)).className === 'blackCellOn blackKingOn') {
                let r = num + 9
                if (r > 127) {
                    r = 127
                }
                if (document.getElementById(String(r)).className === 'emptyCellOn') {
                    if(moves) {
                        document.getElementById(String(r)).className = 'selectCellOn'
                    }else{
                        document.getElementById(String(r)).className = 'selectCellOnHidden'
                    }
                    next = false
                    let arr = document.querySelectorAll('.whiteCellOn')
                    arr.forEach(cell => {
                        if(document.getElementById(cell.id).className === 'whiteCellOn whiteKingOn'){
                            document.getElementById(cell.id).className = 'white whiteQueen'
                        } else document.getElementById(cell.id).className = 'white'
                    })
                }
            }
        }

        //white king logic
        else if(document.getElementById(elem).className === 'whiteCellOn whiteKingOn'){
            let ct = document.querySelectorAll('.selectCellOn')
            ct.forEach(elem => {
                elem.className = 'emptyCellOn'
            })
            activeCell = elem
            let num = Number(elem)
            num = num - 7
            if (num < 64) {
                num = 64
            }
            if (document.getElementById(String(num)).className === 'emptyCellOn' || document.getElementById(String(num)).className === 'whiteCellOn' || document.getElementById(String(num)).className === 'blackCellOn' || document.getElementById(String(num)).className === 'notCellOn' || document.getElementById(String(num)).className === 'blackCellOn blackKingOn' || document.getElementById(String(num)).className === 'whiteCellOn whiteKingOn') {
                next = true
                let arr = document.querySelectorAll('.white')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'white whiteQueen'){
                        document.getElementById(cell.id).className = 'whiteCellOn whiteKingOn'
                    } else document.getElementById(cell.id).className = 'whiteCellOn'
                })
            }
            num = Number(elem)
            num = num - 9
            if (num < 64) {
                num = 64
            }
            if (document.getElementById(String(num)).className === 'emptyCellOn' || document.getElementById(String(num)).className === 'whiteCellOn' || document.getElementById(String(num)).className === 'blackCellOn' || document.getElementById(String(num)).className === 'notCellOn' || document.getElementById(String(num)).className === 'blackCellOn blackKingOn' || document.getElementById(String(num)).className === 'whiteCellOn whiteKingOn') {
                next = true
                let arr = document.querySelectorAll('.white')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'white whiteQueen'){
                        document.getElementById(cell.id).className = 'whiteCellOn whiteKingOn'
                    } else document.getElementById(cell.id).className = 'whiteCellOn'
                })
            }
            num = Number(elem)
            num = num + 7
            if (num > 127) {
                num = 127
            }
            if (document.getElementById(String(num)).className === 'emptyCellOn' || document.getElementById(String(num)).className === 'whiteCellOn' || document.getElementById(String(num)).className === 'blackCellOn' || document.getElementById(String(num)).className === 'notCellOn' || document.getElementById(String(num)).className === 'blackCellOn blackKingOn' || document.getElementById(String(num)).className === 'whiteCellOn whiteKingOn') {
                next = true
                let arr = document.querySelectorAll('.white')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'white whiteQueen'){
                        document.getElementById(cell.id).className = 'whiteCellOn whiteKingOn'
                    } else document.getElementById(cell.id).className = 'whiteCellOn'
                })
            }
            num = Number(elem)
            num = num + 9
            if (num > 127) {
                num = 127
            }
            if (document.getElementById(String(num)).className === 'emptyCellOn' || document.getElementById(String(num)).className === 'whiteCellOn' || document.getElementById(String(num)).className === 'blackCellOn' || document.getElementById(String(num)).className === 'notCellOn' || document.getElementById(String(num)).className === 'blackCellOn blackKingOn' || document.getElementById(String(num)).className === 'whiteCellOn whiteKingOn') {
                next = true
                let arr = document.querySelectorAll('.white')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'white whiteQueen'){
                        document.getElementById(cell.id).className = 'whiteCellOn whiteKingOn'
                    } else document.getElementById(cell.id).className = 'whiteCellOn'
                })
            }
            num = Number(elem)
            num = num - 7
            if (num < 64) {
                num = 64
            }
            if(document.getElementById(String(num)).className === 'blackCellOn' || document.getElementById(String(num)).className === 'blackCellOn blackKingOn'){
                let r = num - 7
                if(r < 64){
                    r = 64
                }
                if(document.getElementById(String(r)).className === 'emptyCellOn'){
                    if(moves) {
                        document.getElementById(String(r)).className = 'selectCellOn'
                    }else{
                        document.getElementById(String(r)).className = 'selectCellOnHidden'
                    }
                    next = false
                    let arr = document.querySelectorAll('.whiteCellOn')
                    arr.forEach(cell => {
                        if(document.getElementById(cell.id).className === 'whiteCellOn whiteKingOn'){
                            document.getElementById(cell.id).className = 'white whiteQueen'
                        } else document.getElementById(cell.id).className = 'white'
                    })
                }
            }
            num = Number(elem)
            num = num - 9
            if (num < 64) {
                num = 64
            }
            if(document.getElementById(String(num)).className === 'blackCellOn' || document.getElementById(String(num)).className === 'blackCellOn blackKingOn'){
                let r = num - 9
                if(r < 64){
                    r = 64
                }
                if(document.getElementById(String(r)).className === 'emptyCellOn'){
                    if(moves) {
                        document.getElementById(String(r)).className = 'selectCellOn'
                    }else{
                        document.getElementById(String(r)).className = 'selectCellOnHidden'
                    }
                    next = false
                    let arr = document.querySelectorAll('.whiteCellOn')
                    arr.forEach(cell => {
                        if(document.getElementById(cell.id).className === 'whiteCellOn whiteKingOn'){
                            document.getElementById(cell.id).className = 'white whiteQueen'
                        } else document.getElementById(cell.id).className = 'white'
                    })
                }
            }
            num = Number(elem)
            num = num + 7
            if (num > 127) {
                num = 127
            }
            if(document.getElementById(String(num)).className === 'blackCellOn' || document.getElementById(String(num)).className === 'blackCellOn blackKingOn'){
                let r = num + 7
                if(r > 127){
                    r = 127
                }
                if(document.getElementById(String(r)).className === 'emptyCellOn'){
                    if(moves) {
                        document.getElementById(String(r)).className = 'selectCellOn'
                    }else{
                        document.getElementById(String(r)).className = 'selectCellOnHidden'
                    }
                    next = false
                    let arr = document.querySelectorAll('.whiteCellOn')
                    arr.forEach(cell => {
                        if(document.getElementById(cell.id).className === 'whiteCellOn whiteKingOn'){
                            document.getElementById(cell.id).className = 'white whiteQueen'
                        } else document.getElementById(cell.id).className = 'white'
                    })
                }
            }
            num = Number(elem)
            num = num + 9
            if (num > 127) {
                num = 127
            }
            if(document.getElementById(String(num)).className === 'blackCellOn' || document.getElementById(String(num)).className === 'blackCellOn blackKingOn'){
                let r = num + 9
                if(r > 127){
                    r = 127
                }
                if(document.getElementById(String(r)).className === 'emptyCellOn'){
                    if(moves) {
                        document.getElementById(String(r)).className = 'selectCellOn'
                    }else{
                        document.getElementById(String(r)).className = 'selectCellOnHidden'
                    }
                    next = false
                    let arr = document.querySelectorAll('.whiteCellOn')
                    arr.forEach(cell => {
                        if(document.getElementById(cell.id).className === 'whiteCellOn whiteKingOn'){
                            document.getElementById(cell.id).className = 'white whiteQueen'
                        } else document.getElementById(cell.id).className = 'white'
                    })
                }
            }
        }

        //black logic
        else if (document.getElementById(elem).className === 'blackCellOn') {
            let ct = document.querySelectorAll('.selectCellOn')
            ct.forEach(elem => {
                elem.className = 'emptyCellOn'
            })
            activeCell = elem
            let num = Number(elem)
            num = num - 7
            if (num < 64) {
                num = 64
            }
            if (document.getElementById(String(num)).className === 'emptyCellOn' || document.getElementById(String(num)).className === 'whiteCellOn' || document.getElementById(String(num)).className === 'blackCellOn' || document.getElementById(String(num)).className === 'notCellOn' || document.getElementById(String(num)).className === 'blackCellOn blackKingOn' || document.getElementById(String(num)).className === 'whiteCellOn whiteKingOn') {
                next = true
                let arr = document.querySelectorAll('.black')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'black blackQueen'){
                        document.getElementById(cell.id).className = 'blackCellOn blackKingOn'
                    } else document.getElementById(cell.id).className = 'blackCellOn'
                })
            }
            num = Number(elem)
            num = num - 9
            if (num < 64) {
                num = 64
            }
            if (document.getElementById(String(num)).className === 'emptyCellOn' || document.getElementById(String(num)).className === 'whiteCellOn' || document.getElementById(String(num)).className === 'blackCellOn' || document.getElementById(String(num)).className === 'notCellOn' || document.getElementById(String(num)).className === 'blackCellOn blackKingOn' || document.getElementById(String(num)).className === 'whiteCellOn whiteKingOn') {
                next = true
                let arr = document.querySelectorAll('.black')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'black blackQueen'){
                        document.getElementById(cell.id).className = 'blackCellOn blackKingOn'
                    } else document.getElementById(cell.id).className = 'blackCellOn'
                })
            }
            num = Number(elem)
            num = num - 7
            if (num < 64) {
                num = 64
            }
            if (document.getElementById(String(num)).className === 'whiteCellOn' || document.getElementById(String(num)).className === 'whiteCellOn whiteKingOn') {
                let r = num - 7
                if (r < 64) {
                    r = 64
                }
                if (document.getElementById(String(r)).className === 'emptyCellOn') {
                    if(!moves) {
                        document.getElementById(String(r)).className = 'selectCellOn'
                    }else{
                        document.getElementById(String(r)).className = 'selectCellOnHidden'
                    }
                    next = false
                    let arr = document.querySelectorAll('.blackCellOn')
                    arr.forEach(cell => {
                        if(document.getElementById(cell.id).className === 'blackCellOn blackKingOn'){
                            document.getElementById(cell.id).className = 'black blackQueen'
                        } else document.getElementById(cell.id).className = 'black'
                    })
                }
            }
            num = num - 2
            if (num < 64) {
                num = 64
            }
            if (document.getElementById(String(num)).className === 'whiteCellOn' || document.getElementById(String(num)).className === 'whiteCellOn whiteKingOn') {
                let r = num - 9
                if (r < 64) {
                    r = 64
                }
                if (document.getElementById(String(r)).className === 'emptyCellOn') {
                    if(!moves) {
                        document.getElementById(String(r)).className = 'selectCellOn'
                    }else{
                        document.getElementById(String(r)).className = 'selectCellOnHidden'
                    }
                    next = false
                    let arr = document.querySelectorAll('.blackCellOn')
                    arr.forEach(cell => {
                        if(document.getElementById(cell.id).className === 'blackCellOn blackKingOn'){
                            document.getElementById(cell.id).className = 'black blackQueen'
                        } else document.getElementById(cell.id).className = 'black'
                    })
                }
            }
        }

        //black king logic
        else if(document.getElementById(elem).className === 'blackCellOn blackKingOn'){
            let ct = document.querySelectorAll('.selectCellOn')
            ct.forEach(elem => {
                elem.className = 'emptyCellOn'
            })
            activeCell = elem
            let num = Number(elem)
            num = num - 7
            if (num < 64) {
                num = 64
            }
            if(document.getElementById(String(num)).className === 'emptyCellOn' || document.getElementById(String(num)).className === 'whiteCellOn' || document.getElementById(String(num)).className === 'blackCellOn' || document.getElementById(String(num)).className === 'notCellOn' || document.getElementById(String(num)).className === 'blackCellOn blackKingOn' || document.getElementById(String(num)).className === 'whiteCellOn whiteKingOn') {
                next = true
                let arr = document.querySelectorAll('.black')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'black blackQueen'){
                        document.getElementById(cell.id).className = 'blackCellOn blackKingOn'
                    } else document.getElementById(cell.id).className = 'blackCellOn'
                })
            }
            num = Number(elem)
            num = num - 9
            if (num < 64) {
                num = 64
            }
            if(document.getElementById(String(num)).className === 'emptyCellOn' || document.getElementById(String(num)).className === 'whiteCellOn' || document.getElementById(String(num)).className === 'blackCellOn' || document.getElementById(String(num)).className === 'notCellOn' || document.getElementById(String(num)).className === 'blackCellOn blackKingOn' || document.getElementById(String(num)).className === 'whiteCellOn whiteKingOn') {
                next = true
                let arr = document.querySelectorAll('.black')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'black blackQueen'){
                        document.getElementById(cell.id).className = 'blackCellOn blackKingOn'
                    } else document.getElementById(cell.id).className = 'blackCellOn'
                })
            }
            num = Number(elem)
            num = num + 7
            if (num > 127) {
                num = 127
            }
            if(document.getElementById(String(num)).className === 'emptyCellOn' || document.getElementById(String(num)).className === 'whiteCellOn' || document.getElementById(String(num)).className === 'blackCellOn' || document.getElementById(String(num)).className === 'notCellOn' || document.getElementById(String(num)).className === 'blackCellOn blackKingOn' || document.getElementById(String(num)).className === 'whiteCellOn whiteKingOn') {
                next = true
                let arr = document.querySelectorAll('.black')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'black blackQueen'){
                        document.getElementById(cell.id).className = 'blackCellOn blackKingOn'
                    } else document.getElementById(cell.id).className = 'blackCellOn'
                })
            }
            num = Number(elem)
            num = num + 9
            if (num > 127) {
                num = 127
            }
            if(document.getElementById(String(num)).className === 'emptyCellOn' || document.getElementById(String(num)).className === 'whiteCellOn' || document.getElementById(String(num)).className === 'blackCellOn' || document.getElementById(String(num)).className === 'notCellOn' || document.getElementById(String(num)).className === 'blackCellOn blackKingOn' || document.getElementById(String(num)).className === 'whiteCellOn whiteKingOn') {
                next = true
                let arr = document.querySelectorAll('.black')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'black blackQueen'){
                        document.getElementById(cell.id).className = 'blackCellOn blackKingOn'
                    } else document.getElementById(cell.id).className = 'blackCellOn'
                })
            }
            num = Number(elem)
            num = num - 7
            if (num < 64) {
                num = 64
            }
            if(document.getElementById(String(num)).className === 'whiteCellOn' || document.getElementById(String(num)).className === 'whiteCellOn whiteKingOn'){
                let r = num - 7
                if(r < 64){
                    r = 64
                }
                if(document.getElementById(String(r)).className === 'emptyCellOn'){
                    if(!moves) {
                        document.getElementById(String(r)).className = 'selectCellOn'
                    }else{
                        document.getElementById(String(r)).className = 'selectCellOnHidden'
                    }
                    next = false
                    let arr = document.querySelectorAll('.blackCellOn')
                    arr.forEach(cell => {
                        if(document.getElementById(cell.id).className === 'blackCellOn blackKingOn'){
                            document.getElementById(cell.id).className = 'black blackQueen'
                        } else document.getElementById(cell.id).className = 'black'
                    })
                }
            }
            num = Number(elem)
            num = num - 9
            if (num < 64) {
                num = 64
            }
            if(document.getElementById(String(num)).className === 'whiteCellOn' || document.getElementById(String(num)).className === 'whiteCellOn whiteKingOn'){
                let r = num - 9
                if(r < 64){
                    r = 64
                }
                if(document.getElementById(String(r)).className === 'emptyCellOn'){
                    if(!moves) {
                        document.getElementById(String(r)).className = 'selectCellOn'
                    }else{
                        document.getElementById(String(r)).className = 'selectCellOnHidden'
                    }
                    next = false
                    let arr = document.querySelectorAll('.blackCellOn')
                    arr.forEach(cell => {
                        if(document.getElementById(cell.id).className === 'blackCellOn blackKingOn'){
                            document.getElementById(cell.id).className = 'black blackQueen'
                        } else document.getElementById(cell.id).className = 'black'
                    })
                }
            }
            num = Number(elem)
            num = num + 7
            if (num > 127) {
                num = 127
            }
            if(document.getElementById(String(num)).className === 'whiteCellOn' || document.getElementById(String(num)).className === 'whiteCellOn whiteKingOn'){
                let r = num + 7
                if(r > 127){
                    r = 127
                }
                if(document.getElementById(String(r)).className === 'emptyCellOn'){
                    if(!moves) {
                        document.getElementById(String(r)).className = 'selectCellOn'
                    }else{
                        document.getElementById(String(r)).className = 'selectCellOnHidden'
                    }
                    next = false
                    let arr = document.querySelectorAll('.blackCellOn')
                    arr.forEach(cell => {
                        if(document.getElementById(cell.id).className === 'blackCellOn blackKingOn'){
                            document.getElementById(cell.id).className = 'black blackQueen'
                        } else document.getElementById(cell.id).className = 'black'
                    })
                }
            }
            num = Number(elem)
            num = num + 9
            if (num > 127) {
                num = 127
            }
            if(document.getElementById(String(num)).className === 'whiteCellOn' || document.getElementById(String(num)).className === 'whiteCellOn whiteKingOn'){
                let r = num + 9
                if(r > 127){
                    r = 127
                }
                if(document.getElementById(String(r)).className === 'emptyCellOn'){
                    if(!moves) {
                        document.getElementById(String(r)).className = 'selectCellOn'
                    }else{
                        document.getElementById(String(r)).className = 'selectCellOnHidden'
                    }
                    next = false
                    let arr = document.querySelectorAll('.blackCellOn')
                    arr.forEach(cell => {
                        if(document.getElementById(cell.id).className === 'blackCellOn blackKingOn'){
                            document.getElementById(cell.id).className = 'black blackQueen'
                        } else document.getElementById(cell.id).className = 'black'
                    })
                }
            }
        }
    }

    return(
        <div className='borderContainer'>

            <div className='fightMessage'>
                <div className={(turn2 === myTurn) ? 'userdatacontainerturn' : 'userdatacontainer'}>
                    <div className='userdataOn'>

                        <div className={myTurn ? 'whiteTurnInfo' : 'notTurn'}><h>White</h></div>

                        <div className={myTurn ? 'notTurn' : 'blackTurnInfo'}><h>Black</h></div>

                        <img src={'/images/' + image} alt=''/>
                        <h>{name}</h>
                    </div>
                </div>
                <h>VS</h>
                <div className={(turn2 === !myTurn) ? 'enemydatacontainerturn' : 'enemydatacontainer'}>
                    <div className='enemydataOn'>
                        <h>{enemyName}</h>
                        <img src={'/images/' + enemyImg} alt=''/>

                        <div className={!myTurn ? 'whiteTurnInfo' : 'notTurn'}><h>White</h></div>

                        <div className={!myTurn ? 'notTurn' : 'blackTurnInfo'}><h>Black</h></div>

                    </div>
                </div>
            </div>

            <div className={turn2 ? 'whiteTurn' : 'notTurn'}><h>White turn</h></div>

            <div className={turn2 ? 'notTurn' : 'blackTurn'}><h>Black turn</h></div>

            <div className='timer'>{timer}</div>

            <div className='onlineBoard'>
                {board.map(elem => {
                    let cl = ''
                    r++
                    if(elem === 0){
                        cl = 'emptyCellOn'
                    }
                    if(elem === 1){
                        cl = 'whiteCellOn'
                    }
                    if(elem === 3){
                        cl = 'blackCellOn'
                    }
                    if(elem === 9){
                        cl = 'notCellOn'
                    }
                    if(elem === 2){
                        cl = 'whiteCellOn whiteKingOn'
                    }
                    if(elem === 4){
                        cl = 'blackCellOn blackKingOn'
                    }
                    if(elem === 8){
                        cl = 'selectCellOn'
                    }
                    arr.push(<CellOnline cla={cl} elem={id} turn2={turn2} myTurn={myTurn}/>)
                    if(r === 8){
                        r = 0
                        let ar = arr
                        arr = []
                        id++
                        return <div className='testRow'>{ar}</div>
                    }
                    id++
                })}
            </div>

            <div className='checkCounter'><h>White: {white}</h><h>Black: {black}</h></div>

            <div className={whiteWin ? 'whiteWin' : 'winDisable'}>
                <h>White win!</h>
                <button onClick={restart}>Close</button>
            </div>

            <div className={blackWin ? 'blackWin' : 'winDisable'}>
                <h>Black win!</h>
                <button onClick={restart}>Close</button>
            </div>

            <div  className='surrenderButton'><button onClick={surrender}>Surrender</button></div>

        </div>
    )
}

export default GameOnline