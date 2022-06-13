import React, {useState} from 'react';
import '../index.css'
import {useSelector} from 'react-redux'
import {socket} from '../socket'
import axios from "axios";
import stringify from "qs-stringify";

function OnlineFriends(user){

    const id  =  useSelector(state => state.login.stateUserId);

    const image  =  useSelector(state => state.login.stateUserImage);

    const name  =  useSelector(state => state.login.stateUserName);

    const [errbool, setErrorBool] = useState(false)

    const [errName, setErrorName] = useState('')

    const [succbool, setSuccBool] = useState(false)

    const [succName, setSuccName] = useState('')

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
     * Make success invisible
     */
    function closeSucc(){
        setSuccBool(false)
    }

    /**
     * Take some text and set it like success message and make success visible
     *
     * @param {string} error - success message
     */
    function openSucc(succmess){
        setSuccBool(true)
        setSuccName(succmess)
    }

    /**
     * Mark friend status disabled where you are sender and where you are receiver
     */
    function deleteFriend(){
        markFriendsStatus1('disabled')
        markFriendsStatus2('disabled')
    }

    /**
     * Mark friend status disabled where you are sender
     */
    async function markFriendsStatus1(status){
        await axios({
            method: "put",
            url: "http://localhost:3000/friend/acceptOrDelete/" + user.user.id + '&' + id + '&' + 'active',
            data: stringify({
                status: status
            })
        }).then(function (response) {
            if (response.data !== '') {
                socket.emit('getUsers', id)
                openSucc('Friend deleted')
            }
        }).catch(function (error) {
            openError('Some error occurred while removing friend')
        });
    }

    /**
     * Mark friend status disabled where you are receiver
     */
    async function markFriendsStatus2(status){
        await axios({
            method: "put",
            url: "http://localhost:3000/friend/acceptOrDelete/" + id + '&' + user.user.id + '&' + 'active',
            data: stringify({
                status: status
            })
        }).then(function (response) {
            if (response.data !== '') {
                socket.emit('getUsers', id)
                openSucc('Friend deleted')
            }
        }).catch(function (error) {
            openError('Some error occurred while removing friend')
        });
    }

    /**
     * Check if user or you already have request
     * @param {string} friend - friend id
     */
    function beforeSendRequest(friend){
        checkGame1(friend)
    }

    /**
     * Check if you have request from user
     * @param {string} friend - user id
     */
    async function checkGame1(friend){
        await axios({
            method: "get",
            url: "http://localhost:3000/notification/getSender/" + id + '&' + friend
        }).then(function (response) {
            if (response.data.length !== 0) {

                openError('You already have a request from this user')

            }
            if(response.data.length === 0){
                checkGame2(friend)
            }
        }).catch(function (error) {
            openError("Some errors occurred while sending request")
        });
    }

    /**
     * Check if user have request from you
     * @param {string} friend - user id
     */
    async function checkGame2(friend){
        await axios({
            method: "get",
            url: "http://localhost:3000/notification/getReceiver/" + friend + "&" + id
        }).then(function (response) {
            if (response.data.length !== 0) {

                openError('You already send a request to this user')

            }
            if(response.data.length === 0){
                newGameNot(friend)
            }
        }).catch(function (error) {
            openError("Some errors occurred while sending request")
        });
    }

    /**
     * Create new game notification
     * @param {string} friend - friend id
     */
    async function newGameNot(friend){
        await axios({
            method: "post",
            url: "http://localhost:3000/notification/create",
            data: stringify({
                sender: id,
                receiver: friend,
                type: 'game',
                sendername: name,
                senderimage: image
            })
        }).then(function (response) {
            if (response.data !== '') {
                socket.emit('notification', user.user.socketid)
                openSucc('Game request are send')
            }
        }).catch(function (error) {
            openError("Some errors occurred while sending request")
        });
    }

    return(
        <>
            <div className='onlinefriend'>

                <div className='avatarName'>

                    <img src={'images/' + user.user.image} alt="userImage"/>

                    <h>{user.user.name}</h>

                </div>

                <div className='userWins'>

                    <h>RP: {user.user.ratingPoints ? user.user.ratingPoints : 0}</h>

                </div>

                <div className={user.user.status + 'Circle'}></div>

            </div>

            <div className='onlineFriendController'>

                <button className={(user.user.status === 'online') ? 'offlineFriend' : 'offlineFrienddisable'} onClick={() => beforeSendRequest(user.user.id)}>Call for a game</button>
                <button onClick={deleteFriend}>Remove friend</button>

            </div>

            <div className={errbool ? 'errorform active' : 'errorform'}>

                <div className='errorH'><h>{errName}</h></div>

                <div className='errorButton'><button onClick={closeError}>Close</button></div>

            </div>

            <div className={succbool ? 'successfulform active' : 'successfulform'}>

                <div className='errorH'><h>{succName}</h></div>

                <div className='errorButton'><button onClick={closeSucc}>Close</button></div>

            </div>

        </>
    )
}

export default OnlineFriends