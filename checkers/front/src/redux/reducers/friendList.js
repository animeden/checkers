import {SET_FRIENDS} from "../actions/actionTypes";

let friends = localStorage.getItem('friends');

const initialState = {
    friends: friends ? JSON.parse(friends) : []
};

const friendsList = (state = initialState, action) => {
    switch (action.type) {
        case SET_FRIENDS:{
            localStorage.setItem("friends", JSON.stringify(action.data));
            return {
                ...state,
                friends: action.data
            };
        }
        default:
            return state;
    }
}

export default friendsList;