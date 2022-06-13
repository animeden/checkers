import {SET_ROOM} from "../actions/actionTypes";


let room = localStorage.getItem('room');

const initialState = {
    room: room ? room : ''
};

const rooms = (state = initialState, action) => {
    switch (action.type) {
        case SET_ROOM:{
            localStorage.setItem("room", action.data);
            return {
                ...state,
                room: action.data
            };
        }
        default:
            return state;
    }
}

export default rooms;