import * as ActionTypes from "../actionTypes";

export const saveConfigs = (year,configs) => {
    return {
        type: ActionTypes.SAVE_CONFIGS,
        payload: {year,configs}
    }
}