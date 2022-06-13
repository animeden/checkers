import React, {useState} from 'react'
import stringify from 'qs-stringify'
import axios from 'axios'
import '../index.css'
import {useSelector} from 'react-redux'
import {useDispatch} from 'react-redux'
import {setNotifications, setLogin, setPasswordRedux, setRoom} from "../redux/actions/index";
import { Redirect } from 'react-router-dom'

function Logreg(){

    const dispatch = useDispatch();

    const id  =  useSelector(state => state.login.stateUserId);

    const [userName, setUserName] = useState("")

    const [password, setPassword] = useState("")

    const [logregtext, setLogregtext] = useState("Didnt have account?")

    const [logregbuttontext, setLogregbuttontext] = useState("Register")

    const [logreg, setLogreg] = useState(false)

    const [log, setLog] = useState(true)

    const[reg, setReg] = useState(false)

    const [errbool, setErrorBool] = useState(false)

    const [errName, setErrorName] = useState('')

    /**
     * When typing change userName data
     * */
    function changeUserName(event){
        setUserName(event.target.value)
    }

    /**
     * When typing change password data
     * */
    function changePassword(event){
        setPassword(event.target.value)
    }

    /**
     * Change a login fields and registration fields and empty all data
     */
    function changeLogReg(){
        if(logreg){
            setLogreg(false)
            setLogregtext('Didnt have account?')
            setLogregbuttontext('Register')
            setLog(true)
            setReg(false)
            setUserName('')
            setPassword('')
            setErrorBool(false)
        }
        if(!logreg){
            setLogreg(true)
            setLogregtext('Already have account?')
            setLogregbuttontext('Login')
            setLog(false)
            setReg(true)
            setUserName('')
            setPassword('')
            setErrorBool(false)
        }
    }

    /**
     * Check if field is not empty and then call registration function
     */
    function registerUser(){
        let name = userName
        let passwrd = password
        if(!name || !passwrd){
            setErrorBool(true)
            setErrorName('You must fill all the fields')
        }else if(name.length < 3 || passwrd.length < 3){
            setErrorBool(true)
            setErrorName('User name and password must contain minimum 3 symbols')
        }
        else {register(name, passwrd)}
    }

    /**
     * Adding new user data to DataBase and adding a data to redux
     *
     * @param {string} login - new user name/login from userName meaning taking if its not empty
     * @param {string} password  - new user password from password meaning taking if its not empty
     */
    async function register(login, password){
        await axios({
            method: "post",
            url: "http://localhost:3000/user/create",
            data: stringify({
                login: login,
                password: password
            })
        }).then(function (response) {
            if (response.data !== '') {
                let event = response.data

                setPassword('')
                setUserName('')

                dispatch(setLogin({name: event.login, id: event.id, wins: event.wins, image: event.image, loses: event.loses, matches: event.matches}));
                dispatch(setPasswordRedux(event.password))
                dispatch(setNotifications({counter: '0', message: []}))
                dispatch(setRoom(event.room))

            }
        }).catch(function (error) {
            openError("This username already in use")
        });
    }

    /**
     * Check if field is not empty and then call login function
     */

    function loginUser(){
        let name = userName
        let passwrd = password
        if(!name || !passwrd){
            setErrorBool(true)
            setErrorName('You must fill all the fields')
        }
        else {login(name, passwrd)}
    }

    /**
     * Find user into DataBase and adding a data to redux
     *
     * @param {string} login - new user name/login from userName meaning taking if its not empty
     * @param {string} password  - new user password from password meaning taking if its not empty
     */
    async function login(login, password){
        await axios({
            method: "get",
            url: "http://localhost:3000/user/login" + login + '&' + password
        }).then(function (response) {
            if (response.data !== '') {
                let event = response.data

                setPassword('')
                setUserName('')

                dispatch(setLogin({name: event[0].login, id: event[0].id, wins: event[0].wins, image: event[0].image, loses: event[0].loses, matches: event[0].matches}));
                dispatch(setPasswordRedux(event[0].password))
                dispatch(setNotifications({counter: '0', message: []}))
                dispatch(setRoom(event[0].room))

            }
        }).catch(function (error) {
            openError("Incorrect username or password")
        });
    }

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

    if(id){
        return <Redirect to={'/home'}/>
    }else

    return(
        <div className="logreg">

            <div className={log ? 'login' : 'loginHide'}>

                <h>Login</h>

                <div className='logregInput'>
                    <label className='labelLogReg'>User Name:</label>
                    <input type="text" value={userName} onChange={changeUserName} placeholder='User name'/>
                </div>

                <div className='logregInput'>
                    <label className='labelLogReg'>Password:</label>
                    <input type="text" value={password} onChange={changePassword} placeholder='Password' type='password'/>
                </div>

                <div className='logregbutton'><button onClick={loginUser}>Login</button></div>

            </div>

            <div className={reg ? 'register' : 'registerHide'}>

                <h>Register</h>

                <div className='logregInput'>
                    <label className='labelLogReg'>User Name:</label>
                    <input type="text" value={userName} onChange={changeUserName} placeholder='User name'/>
                </div>

                <div className='logregInput'>
                    <label className='labelLogReg'>Password:</label>
                    <input type="text" value={password} onChange={changePassword} placeholder='Password' type='password'/>
                </div>

                <div className='logregbutton'><button onClick={registerUser}>Register</button></div>

            </div>

            <h>{logregtext} <button onClick={changeLogReg}>{logregbuttontext}</button></h>

            <div className={errbool ? 'errorform active' : 'errorform'}>

                <div className='errorH'><h>{errName}</h></div>

                <div className='errorButton'><button onClick={closeError}>Close</button></div>

            </div>

        </div>
    )
}

export default Logreg;