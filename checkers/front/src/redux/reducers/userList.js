import {SET_USERS} from "../actions/actionTypes";


let users = localStorage.getItem('users');

const initialState = {
    users: users ? users : []
};

const userList = (state = initialState, action) => {
    switch (action.type) {
        case SET_USERS:{
            localStorage.setItem("users", action.data);
            return {
                ...state,
                users: action.data
            };
        }
        default:
            return state;
    }
}

export default userList;