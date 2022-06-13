import {SET_NOTIFICATIONS} from "../actions/actionTypes";

let notCounter = localStorage.getItem('notification_counter');
let notMessages = localStorage.getItem('notification_messages');

const initialState = {
    stateNotCounter: notCounter ? notCounter : '',
    stateNotMessages: notMessages ? JSON.parse(notMessages) : []
};

const notification = (state = initialState, action) => {
    switch (action.type) {
        case SET_NOTIFICATIONS:{
            localStorage.setItem("notification_counter", action.data.counter);
            localStorage.setItem("notification_messages", JSON.stringify(action.data.message));
            return {
                ...state,
                stateNotCounter: action.data.counter,
                stateNotMessages: action.data.message,
            };
        }
        default:
            return state;
    }
}

export default notification;