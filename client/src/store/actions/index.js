import * as ActionTypes from "../actionTypes";

export const saveUser = (user) => {
    return {
        type: ActionTypes.SAVE_USER,
        payload: user
    }
}
export const logOut = () => {
    return {
        type: ActionTypes.LOG_OUT,

    }
}
export const saveCoursesOfCurrentUser = (courses) => {
    return {
        type: ActionTypes.SAVE_COURSES_OF_CURRENT_USER,
        payload: courses
    }
}
export const updateUserDetails = (newDetails) => {
    return {
        type: ActionTypes.UPDATE_USER,
        payload: newDetails
    }
}

export const saveAllTeachers = (teachers) => {
    return {
        type: ActionTypes.SAVE_ALL_TEACHERS,
        payload: teachers
    }
}