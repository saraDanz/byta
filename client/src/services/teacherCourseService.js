import axios from "axios";
import { BASE_URL } from '../VARIABLES';

export const updateCourseStatus = (_courseId,_teacherId, status) => {
    return axios.put(`${BASE_URL}teacherCourses/updateStatus/${_courseId}/${_teacherId}`, { status });
}