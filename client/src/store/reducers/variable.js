import * as ActionTypes from "../actionTypes";

const initialState = {
    currentYear: null,
    defaultFare: null
}
export const variableReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SAVE_CURRENT_YEAR:
            return {
                ...state,
              currentYear:action.payload
            }
            case ActionTypes.SAVE_DEFAULT_FARE:
                return {
                    ...state,
                  defaultFare:action.payload
                }




    }
    return state;
}
