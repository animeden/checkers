import {SET_NOTCOUNT} from "../actions/actionTypes";

let showCount = localStorage.getItem('show_not_counter');

const initialState = {
    showCount: showCount ? showCount : ''
};

const showNotCount = (state = initialState, action) => {
    switch (action.type) {
        case SET_NOTCOUNT:{
            localStorage.setItem("show_not_counter", action.data);
            return {
                ...state,
                showCount: action.data
            };
        }
        default:
            return state;
    }
}

export default showNotCount;