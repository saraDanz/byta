import * as ActionTypes from "../actionTypes";

const initialState = {
   
    configs: {}
}
export const configReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SAVE_CONFIGS:
            return {
                ...state,
              configs:{...state.configs,[action.payload.year]:action.payload.configs}
            }




    }
    return state;
}
