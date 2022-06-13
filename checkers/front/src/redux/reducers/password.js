import {SET_PASSWORD} from "../actions/actionTypes";


let password = localStorage.getItem('password');

const initialState = {
    password: password ? password : ''
};

const pass = (state = initialState, action) => {
    switch (action.type) {
        case SET_PASSWORD:{
            localStorage.setItem("password", action.data);
            return {
                ...state,
                password: action.data
            };
        }
        default:
            return state;
    }
}

export default pass;