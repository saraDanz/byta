import * as ActionTypes from "../actionTypes";

const initialState = {
    lastClosedMonthAndYear: null,
    isOpen: null
}
export const settingReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SAVE_CURRENT_STATUS:
            return {
                ...state,
                lastClosedMonthAndYear: action.payload.lastClosedMonthAndYear,
                isOpen: action.payload.allStatus
            }




    }
    return state;
}
