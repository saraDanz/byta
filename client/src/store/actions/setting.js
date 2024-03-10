import * as ActionTypes from "../actionTypes";

export const saveCurrentStatus = (status) => {
    return {
        type: ActionTypes.SAVE_CURRENT_STATUS,
        payload: status
    }
}