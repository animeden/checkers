import React, {useState} from 'react'
import '../index.css'
import {useDispatch} from 'react-redux'
import {setLogin, setPasswordRedux} from "../redux/actions/index";
import {useSelector} from 'react-redux'
import {Redirect} from 'react-router-dom'
import * as FaIcons from 'react-icons/fa'
import * as BiIcons from 'react-icons/bi'
import {socket} from "../socket";
import stringify from 'qs-stringify'
import axios from 'axios'

function Settings() {

    const id = useSelector(state => state.login.stateUserId);

    const name = useSelector(state => state.login.stateUserName);

    const image = useSelector(state => state.login.stateUserImage);

    const wins = useSelector(state => state.login.stateUserWins);

    const [changeusname, setChangeUsName] = useState(false);

    const [username, setUserName] = useState('')

    const [changePssword, setChangePssword] = useState(false);

    const [password, setPassword] = useState('')

    const dispatch = useDispatch();

    const [home, setHome] = useState(false)

    const [errbool, setErrorBool] = useState(false)

    const [errName, setErrorName] = useState('')

    const [succbool, setSuccBool] = useState(false)

    const [succName, setSuccName] = useState('')

    const [screenImage, setScreenImage] = useState(false)

    const [changeName, setChangeName] = useState(false)

    const [changePasswordScreen, setChangePasswordScreen] = useState(false)

    const psword = useSelector(state => state.password.password);

    const [ps, setPs] = useState('')

    /**
     * When typing change secondPassword(ps) data
     */
    function changePs(event) {
        setPs(event.target.value)
    }

    /**
     * When typing change newUserName(username) data
     */
    function changeUsername(event) {
        setUserName(event.target.value)
    }

    /**
     * When typing change newPassword(password) data
     */
    function changePassword(event) {
        setPassword(event.target.value)
    }

    /**
     * Open and hide newUserName input
     */
    function showUserNameInput() {
        if (changeusname) {
            setChangeUsName(false)
        }
        if (!changeusname) {
            setChangeUsName(true)
        }
    }

    /**
     * Open and hide newPassword input
     */
    function showPasswordInput() {
        if (changePssword) {
            setChangePssword(false)
        }
        if (!changePssword) {
            setChangePssword(true)
        }
    }

    /**
     * Bring back to home page
     */
    function goHome() {
        setHome(true)
        closeSucc()
        closeError()
    }

    /**
     * Clear all user data from redux
     */
    function logout() {
        closeSucc()
        closeError()
        dispatch(setLogin({name: '', id: '', wins: ''}));
        socket.emit('out')
        window.location.reload()
    }

    /**
     * Open a hidden window when all needed conditions are met
     */
    function openChangeName() {
        if (name === username) {
            openError('You already use this name')
        } else {
            if (username.length <= 3) {
                openError('Username must have more that 3 symbols')
            } else {
                if (!username) {
                    openError('New username cant be empty')
                } else {
                    if (changeName) {
                        setChangeName(false)
                    }
                    if (!changeName) {
                        setChangeName(true)
                    }
                }
            }
        }
    }

    /**
     * Open a hidden window when all needed conditions are met
     */
    function openChangePassword() {
        if (password.length <= 3) {
            openError('Password must have more that 3 symbols')
        } else {
            if (password === psword) {
                openError('You already use this password')
            } else {
                if (changePasswordScreen) {
                    setChangePasswordScreen(false)
                }
                if (!changePasswordScreen) {
                    setChangePasswordScreen(true)
                }
            }
        }
    }

    /**
     * Open or close image change window
     */
    function openOrCloseImageChangeWindow() {
        if (screenImage) {
            setScreenImage(false)
        }
        if (!screenImage) {
            setScreenImage(true)
        }
    }

    /**
     * Update image in DataBase and redux and open success window
     *
     * @param {string} image - name of image
     */
    async function updateImage(image) {
        await axios({
            method: "put",
            url: "http://localhost:3000/user/update/" + id,
            data: stringify({
                image: image
            })
        }).then(function (response) {
            if (response.data !== '') {

                openOrCloseImageChangeWindow()
                dispatch(setLogin({id: id, name: name, wins: wins, image: image}));
                let data = {name: name, image: image}
                socket.emit('newImage', data)
                openSucc('Image changed successfully')

            }
        }).catch(function (error) {
            openError('Cant update image, please try later')
        });
    }

    /**
     * Update userName in DataBase and redux and open success window
     *
     * @param {string} newName - new User name
     */
    async function updateName(newName) {
        await axios({
            method: "put",
            url: "http://localhost:3000/user/update/" + id,
            data: stringify({
                login: newName
            })
        }).then(function (response) {
            if (response.data !== '') {

                openChangeName()
                dispatch(setLogin({id: id, name: newName, wins: wins, image: image}));
                let data = {name: name, newName: newName}
                socket.emit('newUserName', data)
                setUserName('')
                openSucc('Username changed successfully')

            }
        }).catch(function (error) {
            openError('Your new username already in use')
            dispatch(setLogin({id: id, name: name, wins: wins, image: image}));
        });
    }

    /**
     * Check that your newPassword second input the same as first
     *
     * @param {string} passw - second password input
     */
    function checkUpdatePassword(passw) {
        if (passw === ps) {
            updatePassword(passw)
        } else {
            openError('Passwords do not match')
            setPs('')
        }
    }


    /**
     * Update password in DataBase and redux and open success window
     *
     * @param {string} newPassword - new Password
     */
    async function updatePassword(newPassword) {
        await axios({
            method: "put",
            url: "http://localhost:3000/user/update/" + id,
            data: stringify({
                password: newPassword
            })
        }).then(function (response) {
            if (response.data !== '') {

                openChangePassword()
                setPassword('')
                setPs('')
                dispatch(setPasswordRedux(newPassword))
                openSucc('Password changed successfully')

            }
        }).catch(function (error) {
            openError('Some error occurred while updating your password')
        });
    }

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

    if (home) {
        return <Redirect to={'/home'}/>
    } else if (!name) {
        return <Redirect to={'/'}/>
    } else

        return (
            <>

                <div className='settingsback'>
                    <button onClick={goHome}><BiIcons.BiLeftArrow className='backsettingicon'/>Back</button>
                </div>

                <div className='usersettinginfo'>

                    <div className='usersettingphoto'>

                        <div className='edithimage'>

                            <FaIcons.FaEdit className='editimageicon' onClick={openOrCloseImageChangeWindow}/>

                        </div>

                        <img src={'/images/' + image} alt='myImage'/>

                    </div>

                    <h>{name}</h>

                </div>

                <div className='settingchanges'>

                    <div className='settingchangesbutton'>

                        <button onClick={showUserNameInput}>Change User Name</button>

                        <div className={changeusname ? 'settingschangesomething' : 'settingschangesomethingdisable'}>

                            <input type="text" value={username} onChange={changeUsername}
                                   placeholder='Write new user name'/>

                            <button onClick={openChangeName}>Execute</button>

                        </div>


                    </div>

                    <div className='settingchangesbutton'>

                        <button onClick={showPasswordInput}>Change Password</button>

                        <div className={changePssword ? 'settingschangesomething' : 'settingschangesomethingdisable'}>

                            <input type="text" value={password} onChange={changePassword}
                                   placeholder='Write new password'/>

                            <button onClick={openChangePassword}>Execute</button>

                        </div>

                    </div>

                </div>

                <div className='settingslogout'>
                    <button onClick={logout}>Log out</button>
                </div>

                <div className={screenImage ? 'secrennblockerimages' : 'secrennblockerimagesdisable'}>

                    <div className='imageshandler'>

                        <div className='imageLine'>
                            <img src={'/images/default.png'} onClick={() => updateImage('default.png')} alt='default'/>
                            <img src={'/images/bulbasaur.jpg'} onClick={() => updateImage('bulbasaur.jpg')}
                                 alt='bulbasaur'/>
                            <img src={'/images/butterfly.jpg'} onClick={() => updateImage('butterfly.jpg')}
                                 alt='butterfly'/>
                            <img src={'/images/witcher.jpg'} onClick={() => updateImage('witcher.jpg')} alt='witcher'/>
                        </div>

                        <div className='imageLine'>
                            <img src={'/images/cabarga.jpg'} onClick={() => updateImage('cabarga.jpg')} alt='cabarga'/>
                            <img src={'/images/cat.jpg'} onClick={() => updateImage('cat.jpg')} alt='cat'/>
                            <img src={'/images/dog.jpg'} onClick={() => updateImage('dog.jpg')} alt='dog'/>
                            <img src={'/images/xiao_love.jpg'} onClick={() => updateImage('xiao_love.jpg')} alt='xiao'/>
                        </div>

                        <div className='imageLine'>
                            <img src={'/images/hutao.png'} onClick={() => updateImage('hutao.png')} alt='hutao'/>
                            <img src={'/images/insecteyes.jpg'} onClick={() => updateImage('insecteyes.jpg')}
                                 alt='insectEyes'/>
                            <img src={'/images/picachu.png'} onClick={() => updateImage('picachu.png')} alt='picachu'/>
                            <img src={'/images/zhongli.jpg'} onClick={() => updateImage('zhongli.jpg')} alt='zhongli'/>
                        </div>

                        <div className='imageLine'>
                            <img src={'images/raiden.jpg'} onClick={() => updateImage('raiden.jpg')} alt='raiden'/>
                            <img src={'images/squirtle.jpg'} onClick={() => updateImage('squirtle.jpg')}
                                 alt='squirtle'/>
                            <img src={'images/razor.jpg'} onClick={() => updateImage('razor.jpg')} alt='razor'/>
                            <img src={'images/shark.jpg'} onClick={() => updateImage('shark.jpg')} alt='shark'/>
                        </div>

                    </div>

                    <div className='closeimagechanger'>

                        <button onClick={openOrCloseImageChangeWindow}>Close</button>

                    </div>

                </div>

                <div className={changeName ? 'namechange' : 'namechangedisable'}>

                    <h>You really want to change your user name<br/> From <em>{name}</em> to <em>{username}</em> ?</h>

                    <div className='namechangesubmit'>

                        <button onClick={openChangeName}>Cancel</button>
                        <button onClick={() => updateName(username)}>Execute</button>

                    </div>

                </div>

                <div className={changePasswordScreen ? 'passwordchange' : 'passwordchangedisable'}>

                    <h>You really want to change your password ?</h>

                    <div className='passwordchangesubmit'>

                        <div className='passwordchangecenter'>

                            <input type="text" value={ps} onChange={changePs} placeholder='Write new password again'/>
                            <button onClick={() => checkUpdatePassword(password)}>Execute</button>

                        </div>


                        <button onClick={openChangePassword}>Cancel</button>

                    </div>

                </div>

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

export default Settings