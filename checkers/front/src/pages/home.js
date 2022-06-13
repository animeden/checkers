import React, {useState, useEffect} from 'react';
import '../index.css'
import {useDispatch, useSelector} from 'react-redux'
import {
    setUsers,
    setFriends,
    setShowNotCount,
    setLogin,
    setNotifications,
    setRoom,
} from "../redux/actions/index";
import {Redirect} from 'react-router-dom'
import * as FiIcons from 'react-icons/fi'
import * as FaIcons from "react-icons/fa";
import {socket} from '../socket'
import OnlineUsers from "../Components/onlineUsers";
import OnlineFriends from "../Components/onlineFriends";
import FriendNotification from "../Components/friendNotification";
import axios from 'axios'
import Game from "../Components/gameBoard"
import GameOnline from "../Components/gameOnlineBoard";
import GameNotification from "../Components/gameNotification";
import stringify from "qs-stringify";
import Rating from "../Components/rating";

let bool = true

let block = false

function Home() {

    const id = useSelector(state => state.login.stateUserId);

    const name = useSelector(state => state.login.stateUserName);

    const wins = useSelector(state => state.login.stateUserWins);

    const loses = useSelector(state => state.login.stateUserLoses);

    const matches = useSelector(state => state.login.stateUserMatches);

    const image = useSelector(state => state.login.stateUserImage);

    const users = useSelector(state => state.userList.users);

    const friends = useSelector(state => state.friendsList.friends)

    const showNotCount = useSelector(state => state.showNotCount.showCount)

    const dispatch = useDispatch();

    const [settingRedirect, setSettingRedirect] = useState(false);

    const [ratingRedirect, setRatingRedirect] = useState(false)

    const [search, setSearch] = useState('');

    const [searchResult, setSearchResult] = useState(false)

    const [searchArr, setSearchArr] = useState([])

    const [friends_users, setFriends_users] = useState(false)

    const [showNotWindow, setShowNotWindow] = useState(false)

    const notCount = useSelector(state => state.notifications.stateNotCounter);

    const notMess = useSelector(state => state.notifications.stateNotMessages);

    const password = useSelector(state => state.password.password)

    const [errbool, setErrorBool] = useState(false)

    const [errName, setErrorName] = useState('')

    const [doubleMode, setDoubleMode] = useState(false)

    const [onlineMode, setOnlineMode] = useState(false)

    const [modeSelector, setModeSelector] = useState(true)

    const [time, setTime] = useState(0)

    const [showTime, setShowTime] = useState(false)

    const [minutes, setMinutes] = useState(0)

    const [winRate, setWinRate] = useState(0)

    const [rp, setRP] = useState(0)

    const [ratingList, setRatingList] = useState([])

    const [onlineUst, setOnlineUrs] = useState([])

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

    if (bool && id) {

        let ratingPoints = wins * 12 - loses * 4

        if (ratingPoints < 0) {
            ratingPoints = 0
        }

        const userData = {
            id: id,
            name: name,
            wins: wins,
            image: image,
            loses: loses,
            matches: matches,
            ratingPoints: ratingPoints
        }

        socket.emit('newActiveUser', userData)
        bool = false

        getNotificationCount()
        login(name, password)
    }

    /**
     * Find user into DataBase and adding a data to redux
     *
     * @param {string} login - new user name/login from userName meaning taking if its not empty
     * @param {string} password  - new user password from password meaning taking if its not empty
     */
    async function login(login, password) {
        await axios({
            method: "get",
            url: "http://localhost:3000/user/login" + login + '&' + password
        }).then(function (response) {
            if (response.data !== '') {
                let event = response.data

                dispatch(setRoom(event[0].room))
                let myRoom = event[0].room
                console.log(event[0])
                if (myRoom !== 'noRoom') {
                    console.log('working')
                    socket.emit('reconnect', myRoom)
                }

            }
        }).catch(function (error) {
            openError("Incorrect username or password")
        });
    }

    /**
     * Get all info about your notifications
     */
    async function getNotificationCount() {
        await axios({
            method: "get",
            url: "http://localhost:3000/notification/getReceiver/" + id
        }).then(function (response) {
            if (response.data !== '') {
                let event = response.data

                let count = 0

                let arr = []

                event.forEach((elem) => {
                    count++
                    let newData = {
                        notId: elem.id,
                        senderid: String(elem.sender),
                        type: elem.type,
                        sendername: elem.sendername,
                        senderimage: elem.senderimage
                    }
                    arr.push(newData)
                })

                if (count > 0) {
                    dispatch(setShowNotCount('able'))
                }
                if (count === 0) {
                    dispatch(setShowNotCount(''))
                }

                dispatch(setNotifications({counter: count, message: arr}))
            }
        }).catch(function (error) {
            openError("Cant get your notifications")
        });
    }

    /**
     * Open friends menu
     */
    function switchFriends() {
        setRatingRedirect(false)
        setFriends_users(true)
        socket.emit('getUsers', id)
    }

    /**
     * Open notifications window
     */
    function openNotWindow() {
        getNotificationCount()
        setShowNotWindow(true)
    }

    /**
     * Close notifications window
     */
    function closeNotWindow() {
        setShowNotWindow(false)
    }

    /**
     * Open onlineUser menu
     */
    function switchUsers() {
        setRatingRedirect(false)
        setFriends_users(false)
    }

    /**
     * When typing change search data
     * */
    function changeSearch(event) {
        setSearch(event.target.value)
    }

    /**
     * Clear all user data from redux
     */
    function logout() {
        dispatch(setLogin({name: '', id: '', wins: ''}));
        socket.emit('out')
        window.location.reload()
    }

    /**
     * Open setting page
     */
    function settings() {
        setSettingRedirect(true)
    }

    function rating() {
        if(!ratingRedirect){
            getRating()
        }
        setRatingRedirect(!ratingRedirect)
    }

    /**
     * Reload a page
     */
    function refresh() {
        window.location.reload()
    }

    /**
     * Hide search menu
     */
    function show_hide_search() {
        setSearchResult(false)
    }

    /**
     * Needed for open search menu and call finding users function
     */
    function beforeFindUsers() {
        if (search.length < 3) {
            openError('You must write minimum 3 symbols')
        } else {
            setSearchResult(true)
            findUsers();
        }
    }

    /**
     * find all users with name like in search form
     */
    async function findUsers() {
        await axios({
            url: "http://localhost:3000/user/getAll/" + search
        }).then(function (response) {
            if (response.data !== '' && response.data.constructor === Array) {
                let event = response.data

                setSearch('')
                socket.emit('check', event)

            }
        }).catch(function (error) {
            console.log(error)
        });
    }

    async function getRating() {
        await axios({
            url: "http://localhost:3000/user/rating"
        }).then(function (response) {
            if (response.data) {
                let event = response.data

                setRatingList(event)
            }
        }).catch(function (error) {
            console.log(error)
        });
    }

    /**
     * Open one screen mode
     */
    function oneScreenMode() {
        setModeSelector(false)
        setDoubleMode(true)
    }

    /**
     * Open online mode with random person
     */
    function onlineGameMode() {
        setModeSelector(false)
        setOnlineMode(true)
        setShowNotWindow(false)
    }

    /**
     * Reload a page
     */
    async function modeSel() {
        await updateRoom2('noRoom')
        socket.emit('stopTimer')
        window.location.reload()
    }

    function quickGameFind() {
        socket.on('quickGameFind', data => {
            let newData = {
                senderId: data,
                name: name,
                myId: id
            }
            updateRoom2(name)
            socket.emit('addToRoom', newData)
        })
    }

    useEffect(() => {
        socket.on('te', data => {
            console.log(data)
        })

        socket.on('discon', data => {
            block = true
        })

        socket.on('userReconnected', data => {
            setModeSelector(false)
            setOnlineMode(true)
        })

        socket.on('yourFriendList', async data => {
            await dispatch(setFriends(data))
        })

        socket.on('join', data => {
            updateRoom(data.name)
        })

        socket.on('info', dat => {
            let data = {
                myName: name,
                enemyName: dat
            }
            socket.emit('vsInfo', data)
        })

        socket.on('updatedUserList', data => {
            let re = []
            let res = []
            data.forEach(user => {
                re.push(<OnlineUsers user={user}/>)
                res.push(user.id)
            })
            setOnlineUrs(res)
            dispatch(setUsers(re))

            socket.emit('test', id)
        })

        socket.on('checkSucc', (data) => {
            let re = []
            data.forEach(user => {
                re.push(<OnlineUsers user={user}/>)
            })
            setSearchArr(re)
        })

        socket.on('notification', () => {
            getNotificationCount()
        })

        socket.on('openOnlineMode', data => {
            onlineGameMode()
            setShowTime(false)
        })

        socket.on('CantJoinGame', data => {
            openError(data)
        })

        quickGameFind();
        let winsRate = (wins / matches) * 100
        setWinRate(winsRate.toFixed() + "%")
        let ratePoints = wins * 12 - loses * 4
        if (ratePoints < 0) {
            ratePoints = 0
        }
        setRP(ratePoints)
    }, [])

    useEffect(() => {
        let winsRate = (wins / matches) * 100
        setWinRate(winsRate.toFixed() + "%")
        let ratePoints = wins * 12 - loses * 4
        if (ratePoints < 0) {
            ratePoints = 0
        }
        setRP(ratePoints)
    }, [matches])

    /**
     * Update user room
     * @param {string} room - new room name
     */
    async function updateRoom2(room) {
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
     * Update user room
     * @param {string} room - new room name
     */
    async function updateRoom(room) {
        await axios({
            method: "put",
            url: "http://localhost:3000/user/update/" + id,
            data: stringify({
                room: room
            })
        }).then(function (response) {
            if (response.data !== '') {
                dispatch(setRoom(room))
                if (room !== 'noRoom') {
                    console.log('emit')
                    socket.emit('joinToRoom', room)
                }
            }
        }).catch(function (error) {
            openError('Cant update image, please try later')
        });
    }

    /**
     * Start a quick game
     */
    function quickGame() {
        timer()
        setShowTime(true)
        socket.emit('quickGame', name)
    }

    /**
     * Timer
     */
    function timer() {
        let qTime = time + 1
        let min = 0
        const timer = setInterval(() => {
            if (qTime === 60) {
                qTime = 0
                min++
                setMinutes(min)
            }
            setTime(qTime)
            qTime++
            if (qTime === (-1)) {
                clearInterval(timer)
            }
        }, 1000);
    }

    if (settingRedirect) {
        return <Redirect to={'/settings'}/>
    } else if (!id) {
        return <Redirect to={'/'}/>
    } else

        return (
            <>
                <div className='home'>

                    <div className='user'>

                        <div className='userInfo'>

                            <div className='userPhoto'>
                                <img src={'/images/' + image} alt='myImage'/>
                            </div>
                            <h>{name}</h>

                            <div className='userStats'>
                                <div>
                                    <h>Wins: {wins}</h>
                                    <h>Loses: {loses}</h>
                                </div>
                                <h>Matches: {matches}</h>
                                <div>
                                    <h>Win Rate: {winRate}</h>
                                    <h>RP: {rp}</h>
                                </div>
                            </div>
                        </div>

                        <div className='userSettings'>
                            <FiIcons.FiSettings className='settingIcon' onClick={settings}/>
                        </div>

                    </div>

                    <div className={doubleMode ? 'oneScreen' : 'noneMode'}><Game/></div>

                    <div className={modeSelector ? 'modeSelector' : 'noneMode'}>
                        <button onClick={oneScreenMode}>On one screen</button>
                        <button onClick={quickGame}>Quick game</button>
                    </div>

                    <div className={onlineMode ? 'onlineGame' : 'noneMode'}><GameOnline/></div>

                    <div className='onlineUsers'>

                        <div className='searchUser'>
                            <input type="text" value={search} onChange={changeSearch}
                                   placeholder='Write username you want find'/>
                            <button onClick={beforeFindUsers}>Search</button>
                        </div>

                        {ratingRedirect ?
                            <div className={'usersList'}>
                                <div className={'ratingTitle'}>Rating</div>
                                {ratingList.map(user => {
                                    return <Rating user={user} onlineUst={onlineUst}/>
                                })}
                            </div>
                            :
                            <>
                                <div className={friends_users ? 'usersList' : 'listdisable'}>
                                    <div className={'ratingTitle'}>Friend List</div>
                                    {friends.map(user => {
                                        return <OnlineFriends user={user}/>
                                    })}
                                </div>

                                <div className={friends_users ? 'listdisable' : 'usersList'}>
                                    <div className={'ratingTitle'}>Online Users</div>
                                    {users}
                                </div>
                            </>
                        }


                        <div className='friendsorall'>
                            <button className='allusersbutton' onClick={switchUsers}>Online Users</button>
                            <button className='friendsbutton' onClick={switchFriends}>Friends List</button>
                        </div>

                        <div className={'ratingButton'} onClick={rating}>Rating</div>

                    </div>

                </div>

                <div className={block ? 'block' : 'unblock'}>

                    <div className='refresh'>

                        <h>You have been disconnected, please restart a page</h>
                        <FiIcons.FiRefreshCcw className='blockIcon' onClick={refresh}/>

                    </div>

                    <div className='logoutrefresh'>
                        <button onClick={logout}>Log out</button>
                    </div>

                </div>

                <div className={searchResult ? 'searchResult' : 'searchResultdisable'}>
                    <div className='listSearch'>{searchArr}</div>
                    <div className='buttonSearch'>
                        <button onClick={show_hide_search}>Close</button>
                    </div>
                </div>

                <div className='events'><FaIcons.FaBell className='eventsbell' onClick={openNotWindow}/></div>

                <div className={showNotCount ? 'notificationsCounter' : 'notificationsCounterdisable'}>{notCount}</div>

                <div className={showNotWindow ? 'notifications' : 'notificationsdisable'}>
                    <div className='closeNot'>
                        <button onClick={closeNotWindow}>Close</button>
                    </div>
                    <div className='notMess'>{
                        notMess.map(request => {
                            if (request.type === 'friend') {
                                return <FriendNotification notification={request}
                                                           getNotificationCount={getNotificationCount}/>
                            }
                            if (request.type === 'game') {
                                return <GameNotification notification={request}
                                                         getNotificationCount={getNotificationCount}/>
                            }
                        })
                    }</div>
                </div>

                <div className={errbool ? 'errorform active' : 'errorform'}>

                    <div className='errorH'>
                        <h>{errName}</h>
                    </div>

                    <div className='errorButton'>
                        <button onClick={closeError}>Close</button>
                    </div>

                </div>

                <div
                    className={showTime ? 'quickTimer' : 'quickTimerHidden'}>{(minutes === 0) ? '' : minutes + ':'}{time}</div>

            </>
        )
}

export default Home