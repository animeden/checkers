import {SET_LOGIN} from "../actions/actionTypes";

let userName = localStorage.getItem('user_name');
let userId = localStorage.getItem('user_id');
let userWins = localStorage.getItem('user_wins');
let userImage = localStorage.getItem('user_image');
let userLoses = localStorage.getItem('user_loses');
let userMatches = localStorage.getItem('user_matches')

const initialState = {
    stateUserName: userName ? userName : "",
    stateUserId: userId ? userId : "",
    stateUserWins : userWins ? userWins : '0',
    stateUserImage : userImage ? userImage : "",
    stateUserLoses: userLoses ? userLoses : '0',
    stateUserMatches: userMatches ? userMatches : '0'
};

const login = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOGIN:{
            localStorage.setItem("user_name", action.data.name);
            localStorage.setItem("user_id", action.data.id);
            localStorage.setItem("user_wins", action.data.wins);
            localStorage.setItem("user_image", action.data.image);
            localStorage.setItem("user_loses", action.data.loses);
            localStorage.setItem("user_matches", action.data.matches)
            return {
                ...state,
                stateUserName: action.data.name,
                stateUserId: action.data.id,
                stateUserWins: action.data.wins,
                stateUserImage: action.data.image,
                stateUserLoses: action.data.loses,
                stateUserMatches: action.data.matches
            };
        }
        default:
            return state;
    }
}

export default login;