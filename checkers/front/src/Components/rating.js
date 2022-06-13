import React, {useEffect, useState} from 'react';
import '../index.css'
import {useSelector} from "react-redux";
import {socket} from "../socket";
import axios from "axios";
import stringify from "qs-stringify";

function Rating(user) {
    const [onlineUserController, setOnlineUserController] = useState(false);

    const [itsyou, setItsYou] = useState(false)

    const id = useSelector(state => state.login.stateUserId);

    const image = useSelector(state => state.login.stateUserImage);

    const name = useSelector(state => state.login.stateUserName);

    const [succbool, setSuccBool] = useState(false)

    const [succName, setSuccName] = useState('')

    const [errbool, setErrorBool] = useState(false)

    const [errName, setErrorName] = useState('')

    const [online, setOnline] = useState(false)

    /**
     * Take some text and set it like error message and make error visible
     *
     * @param {string} error - error message
     */
    function openError(error) {
        setErrorBool(true)
        setErrorName(error)
    }

    /**
     * Make error invisible
     */
    function closeError() {
        setErrorBool(false)
    }

    /**
     * Make success invisible
     */
    function closeSucc() {
        setSuccBool(false)
    }

    /**
     * Take some text and set it like success message and make success visible
     *
     * @param {string} error - success message
     */
    function openSucc(succmess) {
        setSuccBool(true)
        setSuccName(succmess)
    }

    /**
     * Open or close bottom user controller
     */
    function changeOnlineUserController() {
        if (name === user.user.login) {
            setOnlineUserController(false)
            if (itsyou) {
                setItsYou(false)
            }
            if (!itsyou) {
                setItsYou(true)
            }
        } else {
            if (onlineUserController) {
                setOnlineUserController(false)
            }
            if (!onlineUserController) {
                setOnlineUserController(true)
            }
        }
    }

    /**
     * Call a check function
     * @param {string} friend - id of friend
     */
    function beforeAddFriend(friend) {
        check(friend)
    }

    /**
     * Check if user or you already have request
     * @param {string} friend - friend id
     */
    function beforeSendRequest(friend) {
        checkGame1(friend)
    }

    socket.on('hideButtons', data => {
        if (user.user.socketid === data) {
            setOnlineUserController(false)
            setItsYou(false)
        }
    })

    /**
     * Check if you have request from user
     * @param {string} friend - user id
     */
    async function checkGame1(friend) {
        await axios({
            method: "get",
            url: "http://localhost:3000/notification/getSender/" + id + '&' + friend
        }).then(function (response) {
            if (response.data.length !== 0) {

                openError('You already have a request from this user')

            }
            if (response.data.length === 0) {
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
    async function checkGame2(friend) {
        await axios({
            method: "get",
            url: "http://localhost:3000/notification/getReceiver/" + friend + "&" + id
        }).then(function (response) {
            if (response.data.length !== 0) {

                openError('You already send a request to this user')

            }
            if (response.data.length === 0) {
                newGameNot(friend)
            }
        }).catch(function (error) {
            openError("Some errors occurred while sending request")
        });
    }

    /**
     * Check if you didnt send a request to friend
     * @param {string} friend - friend id
     */
    async function check(friend) {
        await axios({
            method: "get",
            url: "http://localhost:3000/friend/ifExist" + id + "&" + friend + "&" + "inProcess"
        }).then(function (response) {
            if (response.data.length !== 0) {

                openError('You already send a request to this user')

            }
            if (response.data.length === 0) {
                check2(friend)
            }
        }).catch(function (error) {
            openError("Some errors occurred while sending request")
        });
    }

    /**
     * Check if friend didnt send a request to you
     * @param {string} friend - friend id
     */
    async function check2(friend) {
        await axios({
            method: "get",
            url: "http://localhost:3000/friend/ifExist" + friend + '&' + id + '&' + 'inProcess'
        }).then(function (response) {
            if (response.data.length !== 0) {

                openError('You already have a request from this user')

            }
            if (response.data.length === 0) {
                check3(friend)
            }
        }).catch(function (error) {
            openError("Some errors occurred while sending request")
        });
    }

    /**
     * Check if you and friend didnt friends already
     * @param {string} friend - friend id
     */
    async function check3(friend) {
        await axios({
            method: "get",
            url: "http://localhost:3000/friend/ifExist" + id + '&' + friend + '&' + 'active'
        }).then(function (response) {
            if (response.data.length !== 0) {

                openError('You already friends')

            }
            if (response.data.length === 0) {
                check4(friend)
            }
        }).catch(function (error) {
            openError("Some errors occurred while sending request")
        });
    }

    /**
     * Check if you and friend didnt friends already
     * @param {string} friend - friend id
     */
    async function check4(friend) {
        await axios({
            method: "get",
            url: "http://localhost:3000/friend/ifExist" + friend + '&' + id + '&' + 'active'
        }).then(function (response) {
            if (response.data.length !== 0) {

                openError('You already friends')

            }
            if (response.data.length === 0) {
                newFriend(friend)
            }
        }).catch(function (error) {
            openError("Some errors occurred while sending request")
        });
    }

    /**
     * Create new friend request
     * @param {string} friend - friend id
     */
    async function newFriend(friend) {
        await axios({
            method: "post",
            url: "http://localhost:3000/friend/create",
            data: stringify({
                sender: id,
                receiver: friend,
            })
        }).then(function (response) {
            if (response.data !== '') {

                newFriendNot(friend)

            }
        }).catch(function (error) {
            openError("Some errors occurred while sending request")
        });
    }

    /**
     * Create a new friend notification
     * @param {string} friend - friend id
     */
    async function newFriendNot(friend) {
        await axios({
            method: "post",
            url: "http://localhost:3000/notification/create",
            data: stringify({
                sender: id,
                receiver: friend,
                type: 'friend',
                sendername: name,
                senderimage: image
            })
        }).then(function (response) {
            if (response.data !== '') {
                socket.emit('notification', user.user.socketid)
                openSucc('Friend request are send')
            }
        }).catch(function (error) {
            openError("Some errors occurred while sending request")
        });
    }

    /**
     * Create new game notification
     * @param {string} friend - user id
     */
    async function newGameNot(friend) {
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

    useEffect(() => {
        let num = String(user.user.id)
        user.onlineUst.forEach(elem => {
            if (elem === num) {
                setOnline(true)
            }
        })
    }, [])

    return (
        <>
            <div className='onlineuser' onClick={changeOnlineUserController}>

                <div className='avatarName'>

                    <img src={'images/' + user.user.image} alt='userImage'/>

                    <h>{user.user.login}</h>

                </div>

                <div className='userWins'>

                    <h>RP: {user.user.ratingPoints ? user.user.ratingPoints : 0}</h>

                </div>

            </div>

            {online ?
                <>
                    <div className={onlineUserController ? 'onlineUserController' : 'onlineUserControllerdisable'}>

                        <button onClick={() => beforeAddFriend(user.user.id)}>Add to friend list</button>
                        <button onClick={() => beforeSendRequest(user.user.id)}>Call for a game</button>

                    </div>

                    <div className={itsyou ? 'itsyou' : 'itsnotyou'}>
                        <h>Yes, its you:)</h>
                    </div>
                </>
                :
                <div className={onlineUserController ? 'itsyou' : 'itsnotyou'}>
                    <h>This user offline:(</h>
                </div>
            }

            <div className={errbool ? 'errorform active' : 'errorform'}>

                <div className='errorH'>
                    <h>{errName}</h>
                </div>

                <div className='errorButton'>
                    <button onClick={closeError}>Close</button>
                </div>

            </div>

            <div className={succbool ? 'successfulform active' : 'successfulform'}>

                <div className='errorH'>
                    <h>{succName}</h>
                </div>

                <div className='errorButton'>
                    <button onClick={closeSucc}>Close</button>
                </div>

            </div>

        </>
    )
}

export default Rating