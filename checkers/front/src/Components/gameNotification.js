import React, {useEffect, useState} from 'react';
import '../index.css'
import {useDispatch, useSelector} from 'react-redux'
import * as AiIcons from 'react-icons/ai'
import stringify from 'qs-stringify'
import axios from 'axios'
import {socket} from "../socket";
import {setRoom} from "../redux/actions";

function GameNotification({notification, getNotificationCount}){

    const id  =  useSelector(state => state.login.stateUserId);

    const name  =  useSelector(state => state.login.stateUserName);

    const [errbool, setErrorBool] = useState(false)

    const [errName, setErrorName] = useState('')

    const dispatch = useDispatch();

    /**
     * Take some text and set it like error message and make error visible
     *
     * @param {string} error - error message
     */
    function openError(error){
        setErrorBool(true)
        setErrorName(error)
    }

    /**
     * Make error invisible
     */
    function closeError(){
        setErrorBool(false)
    }

    useEffect(() => {
        socket.on('joinGame', () => {
            acceptRequest()
        })
    }, [])

    /**
     * Make friend request active and notification reade
     */
    function acceptRequest(){
        markReaded(notification.notId)
        let data = {
            senderId: notification.senderid,
            name: name,
            myId: id
        }
        updateRoom(name)
        socket.emit('addToRoom', data)
    }

    async function updateRoom(room){
        await axios({
            method: "put",
            url: "http://localhost:3000/user/update/" + id,
            data: stringify({
                room: room
            })
        }).then(function (response) {
            if (response.data !== '') {
                dispatch(setRoom(room))
            }
        }).catch(function (error) {
            openError('Cant update image, please try later')
        });
    }

    /**
     * Check if user or enemy already in game
     */
    function beforeAccept(){
        let data = {
            senderId: notification.senderid,
            myId: id
        }
        socket.emit('checkIfInGame', data)
    }

    /**
     * Make friend request disabled and notification reade
     */
    function rejectRequest(){
        markReaded(notification.notId)
    }

    /**
     * Mark your notification reade
     * @param {string} notID - notification id
     */
    async function markReaded(notID){
        await axios({
            method: "put",
            url: "http://localhost:3000/notification/update/" + notID,
            data: stringify({
                read: 'read'
            })
        }).then(function (response) {
            if (response.data !== '') {
                getNotificationCount()
            }
        }).catch(function (error) {
            openError('Some error occurred while removing notification')
        });
    }

    return(
        <>

            <div className='gameNotification'>
                <img src={'/images/' + notification.senderimage} alt='userImage'/>
                <h>New game request from <em>{notification.sendername}</em></h>
                <div className='gameNotificationAccClo'>
                    <AiIcons.AiOutlineCheck onClick={beforeAccept} className='gameNotificationAccImg'/>
                    <AiIcons.AiOutlineClose onClick={rejectRequest} className='gameNotificationCloImg'/>
                </div>
            </div>

            <div className={errbool ? 'errorform active' : 'errorform'}>

                <div className='errorH'><h>{errName}</h></div>

                <div className='errorButton'><button onClick={closeError}>Close</button></div>

            </div>
        </>
    )
}

export default GameNotification