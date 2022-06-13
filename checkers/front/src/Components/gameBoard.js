import React, {useState, useEffect} from 'react';
import '../index.css'
import {useSelector} from 'react-redux'
import Cell from "./cell";

function Game(){

    const name  =  useSelector(state => state.login.stateUserName);

    const image  =  useSelector(state => state.login.stateUserImage);

    const [turn, setTurn] = useState(true)

    const [activeCell, setActiveCell] = useState('')

    const [white, setWhite] = useState('')

    const [black, setBlack] = useState('')

    const [whiteWin, setWhiteWin] = useState(false)

    const [blackWin, setBlackWin] = useState(false)

    const board = [
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
    let id = 0

    useEffect(() => {
        whiteAndBlack()
    }, [turn])

    /**
     * Count how make black and white checkers left
     */
    function whiteAndBlack(){
        let num
        num = 0
        let wh = document.querySelectorAll('.whiteCell')
        wh.forEach(elem => {
            num++
        })
        setWhite(String(num))
        if(num === 0){
            setBlackWin(true)
        }
        num = 0
        let bl = document.querySelectorAll('.blackCell')
        bl.forEach(elem => {
            num++
        })
        setBlack(String(num))
        if(num === 0){
            setWhiteWin(true)
        }
    }

    /**
     * Reload a window
     */
    function restart(){
        window.location.reload()
    }

    return(
        <div className='borderContainer'>

            <div className='fightMessage'>
                <div className='userdata'>
                    <img src={'/images/' + image} alt=''/>
                    <h>{name}</h>
                </div>
                <h>VS</h>
                <div className='enemydata'>
                    <h>{name}</h>
                    <img src={'/images/' + image} alt=''/>
                </div>
            </div>

            <div className={turn ? 'whiteTurn' : 'notTurn'}><h>White turn</h></div>

            <div className={turn ? 'notTurn' : 'blackTurn'}><h>Black turn</h></div>

           <div className='testBoard'>
               {board.map(elem => {
                   let cl = ''
                   r++
                   if(elem === 0){
                       cl = 'emptyCell'
                   }
                   if(elem === 1){
                       cl = 'whiteCell'
                   }
                   if(elem === 3){
                       cl = 'blackCell'
                   }
                   if(elem === 9){
                       cl = 'notCell'
                   }
                   if(elem === 2){
                       cl = 'whiteCell whiteKing'
                   }
                   if(elem === 4){
                       cl = 'blackCell blackKing'
                   }
                   if(elem === 8){
                       cl = 'selectCell'
                   }
                   arr.push(<Cell cla={cl} elem={id} turn={turn} setTurn={setTurn} activeCell={activeCell} setActiveCell={setActiveCell}/>)
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

        </div>
    )
}

export default Game