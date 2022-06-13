import React from 'react';
import '../index.css'
import * as GiIcons from 'react-icons/gi'
import {socket} from '../socket'
import {useSelector} from 'react-redux'

function CellOnline({cla, elem, turn2, myTurn}){

    const room = useSelector(state => state.room.room)

    /**
     * Send element id to server if your turn and your checker selected
     */
    function cl(){
        if(turn2 && myTurn && (document.getElementById(elem).className === 'whiteCellOn' || document.getElementById(elem).className === 'selectCellOn' || document.getElementById(elem).className === 'whiteCellOn whiteKingOn')) {
            let data = {
                elem: elem,
                room: room
            }
            socket.emit('move', data)
        }
        if(!turn2 && !myTurn && (document.getElementById(elem).className === 'blackCellOn' || document.getElementById(elem).className === 'selectCellOn' || document.getElementById(elem).className === 'blackCellOn blackKingOn')) {
            let data = {
                elem: elem,
                room: room
            }
            socket.emit('move', data)
        }
    }

    return(
        <div className={cla} id={elem} onClick={cl}><h>♛</h><GiIcons.GiToken className='checker'/></div>
    )
}

export default CellOnline