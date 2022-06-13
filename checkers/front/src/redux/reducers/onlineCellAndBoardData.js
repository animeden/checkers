import {SET_CELLBOARD} from "../actions/actionTypes";

let activeCellOnline = localStorage.getItem('active_cell_online');
let boardOnline = localStorage.getItem('board_online');

const initialState = {
    stateActiveCell: activeCellOnline ? activeCellOnline : '',
    stateBoard: boardOnline ? JSON.parse(boardOnline) : []
};

const cellBoard = (state = initialState, action) => {
    switch (action.type) {
        case SET_CELLBOARD:{
            localStorage.setItem("active_cell_online", action.data.cell);
            localStorage.setItem("board_online", JSON.stringify(action.data.board));
            return {
                ...state,
                stateNotCounter: action.data.cell,
                stateNotMessages: action.data.board,
            };
        }
        default:
            return state;
    }
}

export default cellBoard;