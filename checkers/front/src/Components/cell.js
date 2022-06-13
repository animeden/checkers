import React from 'react';
import '../index.css'
import * as GiIcons from "react-icons/gi";

function Cell({cla, elem, turn, setTurn, activeCell, setActiveCell}){

    let next = true

    /**
     * Move logic for each checker
     */
    function cl(){
        //white cell movement logic
        if(turn && document.getElementById(elem).className === 'whiteCell') {
            let ct = document.querySelectorAll('.selectCell')
            ct.forEach(elem => {
                elem.className = 'emptyCell'
            })
            setActiveCell(elem)
            let num = Number(elem)
            num = num + 7
            if(num > 63){
                num = 63
            }
            if(document.getElementById(String(num)).className === 'emptyCell') {
                document.getElementById(String(num)).className = 'selectCell'
            }
            if(document.getElementById(String(num)).className === 'blackCell' || document.getElementById(String(num)).className === 'blackCell blackKing'){
                let r = num + 7
                if(r > 63){
                    r = 63
                }
                if(document.getElementById(String(r)).className === 'emptyCell'){
                    document.getElementById(String(r)).className = 'selectCell'
                }
            }
            num = num + 2
            if(num > 63){
                num = 63
            }
            if(document.getElementById(String(num)).className === 'emptyCell') {
                document.getElementById(String(num)).className = 'selectCell'
            }
            if(document.getElementById(String(num)).className === 'blackCell' || document.getElementById(String(num)).className === 'blackCell blackKing'){
                let r = num + 9
                if(r > 63){
                    r = 63
                }
                if(document.getElementById(String(r)).className === 'emptyCell'){
                    document.getElementById(String(r)).className = 'selectCell'
                }
            }
        }


        //white king movement logic
        else if(turn && document.getElementById(elem).className === 'whiteCell whiteKing'){
            let ct = document.querySelectorAll('.selectCell')
            ct.forEach(elem => {
                elem.className = 'emptyCell'
            })
            setActiveCell(elem)
            let num = Number(elem)
            num = num - 7
            if (num < 0) {
                num = 0
            }
            if(document.getElementById(String(num)).className === 'emptyCell') {
                document.getElementById(String(num)).className = 'selectCell'
            }
            if(document.getElementById(String(num)).className === 'blackCell' || document.getElementById(String(num)).className === 'blackCell blackKing'){
                let r = num - 7
                if(r < 0){
                    r = 0
                }
                if(document.getElementById(String(r)).className === 'emptyCell'){
                    document.getElementById(String(r)).className = 'selectCell'
                }
            }
            num = Number(elem)
            num = num - 9
            if (num < 0) {
                num = 0
            }
            if(document.getElementById(String(num)).className === 'emptyCell') {
                document.getElementById(String(num)).className = 'selectCell'
            }
            if(document.getElementById(String(num)).className === 'blackCell' || document.getElementById(String(num)).className === 'blackCell blackKing'){
                let r = num - 9
                if(r < 0){
                    r = 0
                }
                if(document.getElementById(String(r)).className === 'emptyCell'){
                    document.getElementById(String(r)).className = 'selectCell'
                }
            }
            num = Number(elem)
            num = num + 7
            if (num > 63) {
                num = 63
            }
            if(document.getElementById(String(num)).className === 'emptyCell') {
                document.getElementById(String(num)).className = 'selectCell'
            }
            if(document.getElementById(String(num)).className === 'blackCell' || document.getElementById(String(num)).className === 'blackCell blackKing'){
                let r = num + 7
                if(r > 63){
                    r = 63
                }
                if(document.getElementById(String(r)).className === 'emptyCell'){
                    document.getElementById(String(r)).className = 'selectCell'
                }
            }
            num = Number(elem)
            num = num + 9
            if (num > 63) {
                num = 63
            }
            if(document.getElementById(String(num)).className === 'emptyCell') {
                document.getElementById(String(num)).className = 'selectCell'
            }
            if(document.getElementById(String(num)).className === 'blackCell' || document.getElementById(String(num)).className === 'blackCell blackKing'){
                let r = num + 9
                if(r > 63){
                    r = 63
                }
                if(document.getElementById(String(r)).className === 'emptyCell'){
                    document.getElementById(String(r)).className = 'selectCell'
                }
            }
        }


        //black cell movement logic
        else if(!turn && document.getElementById(elem).className === 'blackCell'){
            let ct = document.querySelectorAll('.selectCell')
            ct.forEach(elem => {
                elem.className = 'emptyCell'
            })
            setActiveCell(elem)
            let num = Number(elem)
            num = num - 7
            if(num < 0){
                num = 0
            }
            if(document.getElementById(String(num)).className === 'emptyCell') {
                document.getElementById(String(num)).className = 'selectCell'
            }
            if(document.getElementById(String(num)).className === 'whiteCell' || document.getElementById(String(num)).className === 'whiteCell whiteKing'){
                let r = num - 7
                if(r < 0){
                    r = 0
                }
                if(document.getElementById(String(r)).className === 'emptyCell'){
                    document.getElementById(String(r)).className = 'selectCell'
                }
            }
            num = num - 2
            if(num < 0){
                num = 0
            }
            if(document.getElementById(String(num)).className === 'emptyCell') {
                document.getElementById(String(num)).className = 'selectCell'
            }
            if(document.getElementById(String(num)).className === 'whiteCell' || document.getElementById(String(num)).className === 'whiteCell whiteKing'){
                let r = num - 9
                if(r < 0){
                    r = 0
                }
                if(document.getElementById(String(r)).className === 'emptyCell'){
                    document.getElementById(String(r)).className = 'selectCell'
                }
            }
        }


        //black king movement logic
        else if(!turn && document.getElementById(elem).className === 'blackCell blackKing'){
            let ct = document.querySelectorAll('.selectCell')
            ct.forEach(elem => {
                elem.className = 'emptyCell'
            })
            setActiveCell(elem)
            let num = Number(elem)
            num = num - 7
            if (num < 0) {
                num = 0
            }
            if(document.getElementById(String(num)).className === 'emptyCell') {
                document.getElementById(String(num)).className = 'selectCell'
            }
            if(document.getElementById(String(num)).className === 'whiteCell' || document.getElementById(String(num)).className === 'whiteCell whiteKing'){
                let r = num - 7
                if(r < 0){
                    r = 0
                }
                if(document.getElementById(String(r)).className === 'emptyCell'){
                    document.getElementById(String(r)).className = 'selectCell'
                }
            }
            num = Number(elem)
            num = num - 9
            if (num < 0) {
                num = 0
            }
            if(document.getElementById(String(num)).className === 'emptyCell') {
                document.getElementById(String(num)).className = 'selectCell'
            }
            if(document.getElementById(String(num)).className === 'whiteCell' || document.getElementById(String(num)).className === 'whiteCell whiteKing'){
                let r = num - 9
                if(r < 0){
                    r = 0
                }
                if(document.getElementById(String(r)).className === 'emptyCell'){
                    document.getElementById(String(r)).className = 'selectCell'
                }
            }
            num = Number(elem)
            num = num + 7
            if (num > 63) {
                num = 63
            }
            if(document.getElementById(String(num)).className === 'emptyCell') {
                document.getElementById(String(num)).className = 'selectCell'
            }
            if(document.getElementById(String(num)).className === 'whiteCell' || document.getElementById(String(num)).className === 'whiteCell whiteKing'){
                let r = num + 7
                if(r > 63){
                    r = 63
                }
                if(document.getElementById(String(r)).className === 'emptyCell'){
                    document.getElementById(String(r)).className = 'selectCell'
                }
            }
            num = Number(elem)
            num = num + 9
            if (num > 63) {
                num = 63
            }
            if(document.getElementById(String(num)).className === 'emptyCell') {
                document.getElementById(String(num)).className = 'selectCell'
            }
            if(document.getElementById(String(num)).className === 'whiteCell' || document.getElementById(String(num)).className === 'whiteCell whiteKing'){
                let r = num + 9
                if(r > 63){
                    r = 63
                }
                if(document.getElementById(String(r)).className === 'emptyCell'){
                    document.getElementById(String(r)).className = 'selectCell'
                }
            }
        }


        //move cell
        else if(document.getElementById(elem).className === 'selectCell'){
            let ct = document.querySelectorAll('.selectCell')
            ct.forEach(elem => {
                elem.className = 'emptyCell'
            })
            console.log(turn)
            //white logic
            if(turn){
                if(document.getElementById(activeCell).className === 'whiteCell' || document.getElementById(activeCell).className === 'white'){
                    document.getElementById(activeCell).className = 'emptyCell'
                    document.getElementById(elem).className = 'whiteCell'
                    let num = Number(activeCell)
                    num = num + 14
                    if (num > 63) {
                        num = 63
                    }
                    if (num === elem) {
                        let r = num - 7
                        if (r < 0) {
                            r = 0
                        }
                        if (document.getElementById(String(r)).className === 'blackCell' || document.getElementById(String(r)).className === 'blackCell blackKing') {
                            document.getElementById(String(r)).className = 'emptyCell'
                            next = false
                            again(elem)
                        }
                    }
                    num = Number(activeCell)
                    num = num + 18
                    if (num > 63) {
                        num = 63
                    }
                    if(num === elem){
                        let r = num - 9
                        if(r < 0){
                            r = 0
                        }
                        if(document.getElementById(String(r)).className === 'blackCell' || document.getElementById(String(r)).className === 'blackCell blackKing') {
                            document.getElementById(String(r)).className = 'emptyCell'
                            next = false
                            again(elem)
                        }
                    }
                }
                if(document.getElementById(activeCell).className === 'whiteCell whiteKing' || document.getElementById(activeCell).className === 'white whiteQueen'){
                    document.getElementById(activeCell).className = 'emptyCell'
                    document.getElementById(elem).className = 'whiteCell whiteKing'
                    let num = Number(activeCell)
                    num = num + 14
                    if (num > 63) {
                        num = 63
                    }
                    if(num === elem){
                        let r = num - 7
                        if(r < 0){
                            r = 0
                        }
                        if(document.getElementById(String(r)).className === 'blackCell' || document.getElementById(String(r)).className === 'blackCell blackKing') {
                            document.getElementById(String(r)).className = 'emptyCell'
                            next = false
                            again(elem)
                        }
                    }
                    num = Number(activeCell)
                    num = num + 18
                    if (num > 63) {
                        num = 63
                    }
                    if(num === elem){
                        let r = num - 9
                        if(r < 0){
                            r = 0
                        }
                        if(document.getElementById(String(r)).className === 'blackCell' || document.getElementById(String(r)).className === 'blackCell blackKing') {
                            document.getElementById(String(r)).className = 'emptyCell'
                            next = false
                            again(elem)
                        }
                    }
                    num = Number(activeCell)
                    num = num - 14
                    if(num < 0){
                        num = 0
                    }
                    if(num === elem){
                        let r = num + 7
                        if(r > 63){
                            r = 63
                        }
                        if(document.getElementById(String(r)).className === 'blackCell' || document.getElementById(String(r)).className === 'blackCell blackKing') {
                            document.getElementById(String(r)).className = 'emptyCell'
                            next = false
                            again(elem)
                        }
                    }
                    num = Number(activeCell)
                    num = num - 18
                    if(num < 0){
                        num = 0
                    }
                    if(num === elem){
                        let r = num + 9
                        if(r > 63){
                            r = 63
                        }
                        if(document.getElementById(String(r)).className === 'blackCell' || document.getElementById(String(r)).className === 'blackCell blackKing') {
                            document.getElementById(String(r)).className = 'emptyCell'
                            next = false
                            again(elem)
                        }
                    }
                }

                if((elem === 56 || elem === 58 || elem === 60 || elem === 62) && document.getElementById(elem).className === 'whiteCell'){
                    document.getElementById(elem).className += ' whiteKing'
                    setTurn(true)
                }
                if(next) {
                    setTurn(false)
                }
            }
        //black logic
        else if(!turn){
                if(document.getElementById(activeCell).className === 'blackCell' || document.getElementById(activeCell).className === 'black') {
                    document.getElementById(activeCell).className = 'emptyCell'
                    document.getElementById(elem).className = 'blackCell'
                    let num = Number(activeCell)
                    num = num - 14
                    if(num === elem){
                        let r = num + 7
                        if(document.getElementById(String(r)).className === 'whiteCell' || document.getElementById(String(r)).className === 'whiteCell whiteKing') {
                            document.getElementById(String(r)).className = 'emptyCell'
                            next = false
                            again(elem)
                        }
                    }
                    num = num - 4
                    if(num === elem){
                        let r = num + 9
                        if(document.getElementById(String(r)).className === 'whiteCell' || document.getElementById(String(r)).className === 'whiteCell whiteKing') {
                            document.getElementById(String(r)).className = 'emptyCell'
                            next = false
                            again(elem)
                        }
                    }
                }
                if(document.getElementById(activeCell).className === 'blackCell blackKing' || document.getElementById(activeCell).className === 'black blackQueen') {
                    document.getElementById(activeCell).className = 'emptyCell'
                    document.getElementById(elem).className = 'blackCell blackKing'
                    let num = Number(activeCell)
                    num = num - 14
                    if(num === elem){
                        let r = num + 7
                        if(document.getElementById(String(r)).className === 'whiteCell' || document.getElementById(String(r)).className === 'whiteCell whiteKing') {
                            document.getElementById(String(r)).className = 'emptyCell'
                            next = false
                            again(elem)
                        }
                    }
                    num = num - 4
                    if(num === elem){
                        let r = num + 9
                        if(document.getElementById(String(r)).className === 'whiteCell' || document.getElementById(String(r)).className === 'whiteCell whiteKing') {
                            document.getElementById(String(r)).className = 'emptyCell'
                            next = false
                            again(elem)
                        }
                    }
                    num = Number(activeCell)
                    num = num + 14
                    if(num === elem){
                        let r = num - 7
                        if(document.getElementById(String(r)).className === 'whiteCell' || document.getElementById(String(r)).className === 'whiteCell whiteKing') {
                            document.getElementById(String(r)).className = 'emptyCell'
                            next = false
                            again(elem)
                        }
                    }
                    num = num + 4
                    if(num === elem){
                        let r = num - 9
                        if(document.getElementById(String(r)).className === 'whiteCell' || document.getElementById(String(r)).className === 'whiteCell whiteKing') {
                            document.getElementById(String(r)).className = 'emptyCell'
                            next = false
                            again(elem)
                        }
                    }
                }
                if((elem === 1 || elem === 3 || elem === 5 || elem === 7) && document.getElementById(elem).className === 'blackCell'){
                    document.getElementById(elem).className += ' blackKing'
                    setTurn(true)
                }
                if(next) {
                    setTurn(true)
                }
            }
        }
    }

    /**
     * Look if checker can move again
     * @param {string} elem - element id
     */
    function again(elem) {
        setActiveCell(elem)

        //recheck for white
        if (turn && document.getElementById(elem).className === 'whiteCell') {
            let ct = document.querySelectorAll('.selectCell')
            ct.forEach(elem => {
                elem.className = 'emptyCell'
            })
            setActiveCell(elem)
            let num = Number(elem)
            num = num + 7
            if (num > 63) {
                num = 63
            }
            if (document.getElementById(String(num)).className === 'emptyCell' || document.getElementById(String(num)).className === 'whiteCell' || document.getElementById(String(num)).className === 'blackCell' || document.getElementById(String(num)).className === 'notCell' || document.getElementById(String(num)).className === 'blackCell blackKing' || document.getElementById(String(num)).className === 'whiteCell whiteKing') {
                setTurn(false)
                next = true
                let arr = document.querySelectorAll('.white')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'white whiteQueen'){
                        document.getElementById(cell.id).className = 'whiteCell whiteKing'
                    } else document.getElementById(cell.id).className = 'whiteCell'
                })
            }
            num = Number(elem)
            num = num + 9
            if (num > 63) {
                num = 63
            }
            if (document.getElementById(String(num)).className === 'emptyCell' || document.getElementById(String(num)).className === 'whiteCell' || document.getElementById(String(num)).className === 'blackCell' || document.getElementById(String(num)).className === 'notCell' || document.getElementById(String(num)).className === 'blackCell blackKing' || document.getElementById(String(num)).className === 'whiteCell whiteKing') {
                setTurn(false)
                next = true
                let arr = document.querySelectorAll('.white')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'white whiteQueen'){
                        document.getElementById(cell.id).className = 'whiteCell whiteKing'
                    } else document.getElementById(cell.id).className = 'whiteCell'
                })
            }
            num = Number(elem)
            num = num + 7
            if (num > 63) {
                num = 63
            }
            if (document.getElementById(String(num)).className === 'blackCell' || document.getElementById(String(num)).className === 'blackCell blackKing') {
                let r = num + 7
                if (r > 63) {
                    r = 63
                }
                if (document.getElementById(String(r)).className === 'emptyCell') {
                    document.getElementById(String(r)).className = 'selectCell'
                    setTurn(true)
                    next = false
                    let arr = document.querySelectorAll('.whiteCell')
                    arr.forEach(cell => {
                        if(document.getElementById(cell.id).className === 'whiteCell whiteKing'){
                            document.getElementById(cell.id).className = 'white whiteQueen'
                        } else document.getElementById(cell.id).className = 'white'
                    })
                }
            }
            num = Number(elem)
            num = num + 9
            if (num > 63) {
                num = 63
            }
            if (document.getElementById(String(num)).className === 'blackCell' || document.getElementById(String(num)).className === 'blackCell blackKing') {
                let r = num + 9
                if (r > 63) {
                    r = 63
                }
                if (document.getElementById(String(r)).className === 'emptyCell') {
                    document.getElementById(String(r)).className = 'selectCell'
                    setTurn(true)
                    next = false
                    let arr = document.querySelectorAll('.whiteCell')
                    arr.forEach(cell => {
                        if(document.getElementById(cell.id).className === 'whiteCell whiteKing'){
                            document.getElementById(cell.id).className = 'white whiteQueen'
                        } else document.getElementById(cell.id).className = 'white'
                    })
                }
            }
        }



        else if(turn && document.getElementById(elem).className === 'whiteCell whiteKing'){
            let ct = document.querySelectorAll('.selectCell')
            ct.forEach(elem => {
                elem.className = 'emptyCell'
            })
            setActiveCell(elem)
            let num = Number(elem)
            num = num - 7
            if (num < 0) {
                num = 0
            }
            if (document.getElementById(String(num)).className === 'emptyCell' || document.getElementById(String(num)).className === 'whiteCell' || document.getElementById(String(num)).className === 'blackCell' || document.getElementById(String(num)).className === 'notCell' || document.getElementById(String(num)).className === 'blackCell blackKing' || document.getElementById(String(num)).className === 'whiteCell whiteKing') {
                setTurn(false)
                next = true
                let arr = document.querySelectorAll('.white')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'white whiteQueen'){
                        document.getElementById(cell.id).className = 'whiteCell whiteKing'
                    } else document.getElementById(cell.id).className = 'whiteCell'
                })
            }
            num = Number(elem)
            num = num - 9
            if (num < 0) {
                num = 0
            }
            if (document.getElementById(String(num)).className === 'emptyCell' || document.getElementById(String(num)).className === 'whiteCell' || document.getElementById(String(num)).className === 'blackCell' || document.getElementById(String(num)).className === 'notCell' || document.getElementById(String(num)).className === 'blackCell blackKing' || document.getElementById(String(num)).className === 'whiteCell whiteKing') {
                setTurn(false)
                next = true
                let arr = document.querySelectorAll('.white')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'white whiteQueen'){
                        document.getElementById(cell.id).className = 'whiteCell whiteKing'
                    } else document.getElementById(cell.id).className = 'whiteCell'
                })
            }
            num = Number(elem)
            num = num + 7
            if (num > 63) {
                num = 63
            }
            if (document.getElementById(String(num)).className === 'emptyCell' || document.getElementById(String(num)).className === 'whiteCell' || document.getElementById(String(num)).className === 'blackCell' || document.getElementById(String(num)).className === 'notCell' || document.getElementById(String(num)).className === 'blackCell blackKing' || document.getElementById(String(num)).className === 'whiteCell whiteKing') {
                setTurn(false)
                next = true
                let arr = document.querySelectorAll('.white')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'white whiteQueen'){
                        document.getElementById(cell.id).className = 'whiteCell whiteKing'
                    } else document.getElementById(cell.id).className = 'whiteCell'
                })
            }
            num = Number(elem)
            num = num + 9
            if (num > 63) {
                num = 63
            }
            if (document.getElementById(String(num)).className === 'emptyCell' || document.getElementById(String(num)).className === 'whiteCell' || document.getElementById(String(num)).className === 'blackCell' || document.getElementById(String(num)).className === 'notCell' || document.getElementById(String(num)).className === 'blackCell blackKing' || document.getElementById(String(num)).className === 'whiteCell whiteKing') {
                setTurn(false)
                next = true
                let arr = document.querySelectorAll('.white')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'white whiteQueen'){
                        document.getElementById(cell.id).className = 'whiteCell whiteKing'
                    } else document.getElementById(cell.id).className = 'whiteCell'
                })
            }
            num = Number(elem)
            num = num - 7
            if (num < 0) {
                num = 0
            }
            if(document.getElementById(String(num)).className === 'blackCell' || document.getElementById(String(num)).className === 'blackCell blackKing'){
                let r = num - 7
                if(r < 0){
                    r = 0
                }
                if(document.getElementById(String(r)).className === 'emptyCell'){
                    document.getElementById(String(r)).className = 'selectCell'
                    setTurn(true)
                    next = false
                    let arr = document.querySelectorAll('.whiteCell')
                    arr.forEach(cell => {
                        if(document.getElementById(cell.id).className === 'whiteCell whiteKing'){
                            document.getElementById(cell.id).className = 'white whiteQueen'
                        } else document.getElementById(cell.id).className = 'white'
                    })
                }
            }
            num = Number(elem)
            num = num - 9
            if (num < 0) {
                num = 0
            }
            if(document.getElementById(String(num)).className === 'blackCell' || document.getElementById(String(num)).className === 'blackCell blackKing'){
                let r = num - 9
                if(r < 0){
                    r = 0
                }
                if(document.getElementById(String(r)).className === 'emptyCell'){
                    document.getElementById(String(r)).className = 'selectCell'
                    setTurn(true)
                    next = false
                    let arr = document.querySelectorAll('.whiteCell')
                    arr.forEach(cell => {
                        if(document.getElementById(cell.id).className === 'whiteCell whiteKing'){
                            document.getElementById(cell.id).className = 'white whiteQueen'
                        } else document.getElementById(cell.id).className = 'white'
                    })
                }
            }
            num = Number(elem)
            num = num + 7
            if (num > 63) {
                num = 63
            }
            if(document.getElementById(String(num)).className === 'blackCell' || document.getElementById(String(num)).className === 'blackCell blackKing'){
                let r = num + 7
                if(r > 63){
                    r = 63
                }
                if(document.getElementById(String(r)).className === 'emptyCell'){
                    document.getElementById(String(r)).className = 'selectCell'
                    setTurn(true)
                    next = false
                    let arr = document.querySelectorAll('.whiteCell')
                    arr.forEach(cell => {
                        if(document.getElementById(cell.id).className === 'whiteCell whiteKing'){
                            document.getElementById(cell.id).className = 'white whiteQueen'
                        } else document.getElementById(cell.id).className = 'white'
                    })
                }
            }
            num = Number(elem)
            num = num + 9
            if (num > 63) {
                num = 63
            }
            if(document.getElementById(String(num)).className === 'blackCell' || document.getElementById(String(num)).className === 'blackCell blackKing'){
                let r = num + 9
                if(r > 63){
                    r = 63
                }
                if(document.getElementById(String(r)).className === 'emptyCell'){
                    document.getElementById(String(r)).className = 'selectCell'
                    setTurn(true)
                    next = false
                    let arr = document.querySelectorAll('.whiteCell')
                    arr.forEach(cell => {
                        if(document.getElementById(cell.id).className === 'whiteCell whiteKing'){
                            document.getElementById(cell.id).className = 'white whiteQueen'
                        } else document.getElementById(cell.id).className = 'white'
                    })
                }
            }
        }


        //recheck for black
        else if (!turn && document.getElementById(elem).className === 'blackCell') {
            let ct = document.querySelectorAll('.selectCell')
            ct.forEach(elem => {
                elem.className = 'emptyCell'
            })
            setActiveCell(elem)
            let num = Number(elem)
            num = num - 7
            if (num < 0) {
                num = 0
            }
            if (document.getElementById(String(num)).className === 'emptyCell' || document.getElementById(String(num)).className === 'whiteCell' || document.getElementById(String(num)).className === 'blackCell' || document.getElementById(String(num)).className === 'notCell' || document.getElementById(String(num)).className === 'blackCell blackKing' || document.getElementById(String(num)).className === 'whiteCell whiteKing') {
                setTurn(true)
                next = true
                let arr = document.querySelectorAll('.black')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'black blackQueen'){
                        document.getElementById(cell.id).className = 'blackCell blackKing'
                    } else document.getElementById(cell.id).className = 'blackCell'
                })
            }
            num = Number(elem)
            num = num - 9
            if (num < 0) {
                num = 0
            }
            if (document.getElementById(String(num)).className === 'emptyCell' || document.getElementById(String(num)).className === 'whiteCell' || document.getElementById(String(num)).className === 'blackCell' || document.getElementById(String(num)).className === 'notCell' || document.getElementById(String(num)).className === 'blackCell blackKing' || document.getElementById(String(num)).className === 'whiteCell whiteKing') {
                setTurn(true)
                next = true
                let arr = document.querySelectorAll('.black')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'black blackQueen'){
                        document.getElementById(cell.id).className = 'blackCell blackKing'
                    } else document.getElementById(cell.id).className = 'blackCell'
                })
            }
            num = Number(elem)
            num = num - 7
            if (num < 0) {
                num = 0
            }
            if (document.getElementById(String(num)).className === 'whiteCell' || document.getElementById(String(num)).className === 'whiteCell whiteKing') {
                let r = num - 7
                if (r < 0) {
                    r = 0
                }
                if (document.getElementById(String(r)).className === 'emptyCell') {
                    document.getElementById(String(r)).className = 'selectCell'
                    setTurn(false)
                    next = false
                    let arr = document.querySelectorAll('.blackCell')
                    arr.forEach(cell => {
                        if(document.getElementById(cell.id).className === 'blackCell blackKing'){
                            document.getElementById(cell.id).className = 'black blackQueen'
                        } else document.getElementById(cell.id).className = 'black'
                    })
                }
            }
            num = num - 2
            if (num < 0) {
                num = 0
            }
            if (document.getElementById(String(num)).className === 'whiteCell' || document.getElementById(String(num)).className === 'whiteCell whiteKing') {
                let r = num - 9
                if (r < 0) {
                    r = 0
                }
                if (document.getElementById(String(r)).className === 'emptyCell') {
                    document.getElementById(String(r)).className = 'selectCell'
                    setTurn(false)
                    next = false
                    let arr = document.querySelectorAll('.blackCell')
                    arr.forEach(cell => {
                        if(document.getElementById(cell.id).className === 'blackCell blackKing'){
                            document.getElementById(cell.id).className = 'black blackQueen'
                        } else document.getElementById(cell.id).className = 'black'
                    })
                }
            }
        }



        else if(!turn && document.getElementById(elem).className === 'blackCell blackKing'){
            let ct = document.querySelectorAll('.selectCell')
            ct.forEach(elem => {
                elem.className = 'emptyCell'
            })
            setActiveCell(elem)
            let num = Number(elem)
            num = num - 7
            if (num < 0) {
                num = 0
            }
            if(document.getElementById(String(num)).className === 'emptyCell' || document.getElementById(String(num)).className === 'whiteCell' || document.getElementById(String(num)).className === 'blackCell' || document.getElementById(String(num)).className === 'notCell' || document.getElementById(String(num)).className === 'blackCell blackKing' || document.getElementById(String(num)).className === 'whiteCell whiteKing') {
                setTurn(true)
                next = true
                let arr = document.querySelectorAll('.black')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'black blackQueen'){
                        document.getElementById(cell.id).className = 'blackCell blackKing'
                    } else document.getElementById(cell.id).className = 'blackCell'
                })
            }
            num = Number(elem)
            num = num - 9
            if (num < 0) {
                num = 0
            }
            if(document.getElementById(String(num)).className === 'emptyCell' || document.getElementById(String(num)).className === 'whiteCell' || document.getElementById(String(num)).className === 'blackCell' || document.getElementById(String(num)).className === 'notCell' || document.getElementById(String(num)).className === 'blackCell blackKing' || document.getElementById(String(num)).className === 'whiteCell whiteKing') {
                setTurn(true)
                next = true
                let arr = document.querySelectorAll('.black')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'black blackQueen'){
                        document.getElementById(cell.id).className = 'blackCell blackKing'
                    } else document.getElementById(cell.id).className = 'blackCell'
                })
            }
            num = Number(elem)
            num = num + 7
            if (num > 63) {
                num = 63
            }
            if(document.getElementById(String(num)).className === 'emptyCell' || document.getElementById(String(num)).className === 'whiteCell' || document.getElementById(String(num)).className === 'blackCell' || document.getElementById(String(num)).className === 'notCell' || document.getElementById(String(num)).className === 'blackCell blackKing' || document.getElementById(String(num)).className === 'whiteCell whiteKing') {
                setTurn(true)
                next = true
                let arr = document.querySelectorAll('.black')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'black blackQueen'){
                        document.getElementById(cell.id).className = 'blackCell blackKing'
                    } else document.getElementById(cell.id).className = 'blackCell'
                })
            }
            num = Number(elem)
            num = num + 9
            if (num > 63) {
                num = 63
            }
            if(document.getElementById(String(num)).className === 'emptyCell' || document.getElementById(String(num)).className === 'whiteCell' || document.getElementById(String(num)).className === 'blackCell' || document.getElementById(String(num)).className === 'notCell' || document.getElementById(String(num)).className === 'blackCell blackKing' || document.getElementById(String(num)).className === 'whiteCell whiteKing') {
                setTurn(true)
                next = true
                let arr = document.querySelectorAll('.black')
                arr.forEach(cell => {
                    if(document.getElementById(cell.id).className === 'black blackQueen'){
                        document.getElementById(cell.id).className = 'blackCell blackKing'
                    } else document.getElementById(cell.id).className = 'blackCell'
                })
            }
            num = Number(elem)
            num = num - 7
            if (num < 0) {
                num = 0
            }
            if(document.getElementById(String(num)).className === 'whiteCell' || document.getElementById(String(num)).className === 'whiteCell whiteKing'){
                let r = num - 7
                if(r < 0){
                    r = 0
                }
                if(document.getElementById(String(r)).className === 'emptyCell'){
                    document.getElementById(String(r)).className = 'selectCell'
                    setTurn(false)
                    next = false
                    let arr = document.querySelectorAll('.blackCell')
                    arr.forEach(cell => {
                        if(document.getElementById(cell.id).className === 'blackCell blackKing'){
                            document.getElementById(cell.id).className = 'black blackQueen'
                        } else document.getElementById(cell.id).className = 'black'
                    })
                }
            }
            num = Number(elem)
            num = num - 9
            if (num < 0) {
                num = 0
            }
            if(document.getElementById(String(num)).className === 'whiteCell' || document.getElementById(String(num)).className === 'whiteCell whiteKing'){
                let r = num - 9
                if(r < 0){
                    r = 0
                }
                if(document.getElementById(String(r)).className === 'emptyCell'){
                    document.getElementById(String(r)).className = 'selectCell'
                    setTurn(false)
                    next = false
                    let arr = document.querySelectorAll('.blackCell')
                    arr.forEach(cell => {
                        if(document.getElementById(cell.id).className === 'blackCell blackKing'){
                            document.getElementById(cell.id).className = 'black blackQueen'
                        } else document.getElementById(cell.id).className = 'black'
                    })
                }
            }
            num = Number(elem)
            num = num + 7
            if (num > 63) {
                num = 63
            }
            if(document.getElementById(String(num)).className === 'whiteCell' || document.getElementById(String(num)).className === 'whiteCell whiteKing'){
                let r = num + 7
                if(r > 63){
                    r = 63
                }
                if(document.getElementById(String(r)).className === 'emptyCell'){
                    document.getElementById(String(r)).className = 'selectCell'
                    setTurn(false)
                    next = false
                    let arr = document.querySelectorAll('.blackCell')
                    arr.forEach(cell => {
                        if(document.getElementById(cell.id).className === 'blackCell blackKing'){
                            document.getElementById(cell.id).className = 'black blackQueen'
                        } else document.getElementById(cell.id).className = 'black'
                    })
                }
            }
            num = Number(elem)
            num = num + 9
            if (num > 63) {
                num = 63
            }
            if(document.getElementById(String(num)).className === 'whiteCell' || document.getElementById(String(num)).className === 'whiteCell whiteKing'){
                let r = num + 9
                if(r > 63){
                    r = 63
                }
                if(document.getElementById(String(r)).className === 'emptyCell'){
                    document.getElementById(String(r)).className = 'selectCell'
                    setTurn(false)
                    next = false
                    let arr = document.querySelectorAll('.blackCell')
                    arr.forEach(cell => {
                        if(document.getElementById(cell.id).className === 'blackCell blackKing'){
                            document.getElementById(cell.id).className = 'black blackQueen'
                        } else document.getElementById(cell.id).className = 'black'
                    })
                }
            }
        }
    }

    return(
        <div className={cla} id={elem} onClick={cl}><h>♛</h><GiIcons.GiToken className='checker'/></div>
    )
}

export default Cell