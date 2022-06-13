import React, {useState} from 'react';
import '../index.css'
import {useSelector} from 'react-redux'
import * as AiIcons from 'react-icons/ai'
import stringify from 'qs-stringify'
import axios from 'axios'
import {socket} from "../socket";

function FriendNotification({notification, getNotificationCount}){

    const id  =  useSelector(state => state.login.stateUserId);

    const [errbool, setErrorBool] = useState(false)

    const [errName, setErrorName] = useState('')

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

    /**
     * Make friend request active and notification reade
     */
    function acceptRequest(){
        markReaded(notification.notId)
        markFriendsStatus('active')
        socket.emit('getUsers', id)
    }

    /**
     * Make friend request disabled and notification reade
     */
    function rejectRequest(){
        markReaded(notification.notId)
        markFriendsStatus('disabled')
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

    /**
     * Make friends status of preset
     * @param {string} status - status which notification must be changed
     */
    async function markFriendsStatus(status){
        await axios({
            method: "put",
            url: "http://localhost:3000/friend/acceptOrDelete/" + notification.senderid + '&' + id + '&' + 'inProcess',
            data: stringify({
                status: status
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

            <div className='friendNotification'>
                <img src={'/images/' + notification.senderimage} alt='userImage'/>
                <h>New friend request from <em>{notification.sendername}</em></h>
                <div className='friendNotificationAccClo'>
                    <AiIcons.AiOutlineCheck onClick={acceptRequest} className='friendNotificationAccImg'/>
                    <AiIcons.AiOutlineClose onClick={rejectRequest} className='friendNotificationCloImg'/>
                </div>
            </div>

            <div className={errbool ? 'errorform active' : 'errorform'}>

                <div className='errorH'><h>{errName}</h></div>

                <div className='errorButton'><button onClick={closeError}>Close</button></div>

            </div>
        </>
    )
}

export default FriendNotification