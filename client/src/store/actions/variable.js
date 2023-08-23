import * as ActionTypes from "../actionTypes";

export const saveCurrentYear = (year) => {
    return {
        type: ActionTypes.SAVE_CURRENT_YEAR,
        payload: year
    }
}
export const saveDefaultFare = (fare) => {
    return {
        type: ActionTypes.SAVE_DEFAULT_FARE,
        payload: fare
    }
}