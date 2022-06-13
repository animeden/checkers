import {
    SET_FRIENDS,
    SET_LOGIN,
    SET_USERS,
    SET_PASSWORD,
    SET_NOTIFICATIONS,
    SET_NOTCOUNT,
    SET_CELLBOARD,
    SET_ROOM
} from "./actionTypes";

export const setLogin = (data) => ({
    type: SET_LOGIN,
    data: data
})

export const setUsers = (data) => ({
    type: SET_USERS,
    data: data
})

export const setFriends = (data) => ({
    type: SET_FRIENDS,
    data: data
})

export const setPasswordRedux = (data) => ({
    type: SET_PASSWORD,
    data: data
})

export const setNotifications = (data) => ({
    type: SET_NOTIFICATIONS,
    data: data
})

export const setShowNotCount = (data) => ({
    type: SET_NOTCOUNT,
    data: data
})

export const setCelBoard = (data) => ({
    type: SET_CELLBOARD,
    data: data
})

export const setRoom = (data) => ({
    type: SET_ROOM,
    data: data
})