import * as ActionTypes from "../actionTypes";
const initialState = {
    currentUser: null,
    courses: []
}
export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SAVE_USER:
            return {
                ...state,
                currentUser: action.payload
            }

        case ActionTypes.LOG_OUT:
            return {
                ...state,
                currentUser: null,
                courses: []
            }
        case ActionTypes.SAVE_COURSES_OF_CURRENT_USER:
            return {
                ...state,
                courses: action.payload
            }
        default: return state;
    }
}