import "./AddTeacherToCourse.css";
import React, { useState, useEffect } from "react";

import { Formik } from "formik";
// import * as EmailValidator from "email-validator";
// import * as Yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { saveUser } from "./store/actions"
import { BASE_URL } from "./VARIABLES";
import CourseSelectListItem from "./CourseSelectListItem";
export default function AddTeacherToCourse() {
    let dispatch = useDispatch();
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    useEffect(() => {
        axios.get(BASE_URL + "courses").
            then(res => {
                console.log(res.data);
                setCourses(res.data);
            }).
            catch(err => {
                console.log(err);
                alert("תקלה בהצגת הקורסים")
            })
        axios.get(BASE_URL + "users").
            then(res => {
                console.log(res.data);
                setTeachers(res.data);
            }).
            catch(err => {
                console.log(err);
                alert("תקלה בהצגת הקורסים")
            })
    }, []);
    let navigate = useNavigate();
    return <div className="add-teacher-to-course">
        <Formik
            initialValues={{ courseId: "", teacherId: "" }}
            onSubmit={(values, { setSubmitting }) => {
                if (!values.courseId&&courses) values.courseId = courses[0]._id;
                if (!values.teacherId&&teachers) values.teacherId = teachers[0]._id;

                axios.post(BASE_URL + "teacherCourses", values).then(res => {
                    console.log(res)
                    console.log("teacher added to course", values);
                    // dispatch(saveUser(res.data))
                    setSubmitting(false);

                    // if (res.data.role == 1)
                    //     navigate("/report")
                    // else
                    //     navigate("/director")


                }).catch(err => {
                    console.log(err);

                    alert("התרחשה תקלה בהוספת המורה לקורס");

                    setSubmitting(false);
                })

            }}

            validate={values => {
                let errors = {};
                // if (!values.courseId) {
                //     errors.courseId = "שדה חובה";
                // }
                // if (!values.teacherId) {
                //     errors.teacherId = "שדה חובה";
                // }
                return errors;
            }}
        >
            {props => {
                const {
                    values,
                    touched,
                    errors,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit
                } = props;

                return (
                    <form onSubmit={handleSubmit}>
                        <label>מורה</label>
                        <select
                            id="teacherId"
                            name="teacherId"

                            placeholder="הקש קוד  מורה"
                            value={values.teacherId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.teacherId && touched.teacherId && "error"}
                        >
                  
                            {teachers.map((item) => { return <option value={item._id} key={item._id}>{item.firstName + " " + item.lastName}</option> })}
                        </select>
                        {errors.teacherId && touched.teacherId && (
                            <div className="input-feedback">{errors.teacherId}</div>
                        )}



                        <select
                            id="courseId"
                            name="courseId"
                            placeholder="הקש קוד קורס"
                            value={values.courseId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.courseId && touched.courseId && "error"}
                        >
                     

                            {courses.map((item, index) => { return <option value={item._id} key={item._id} ><CourseSelectListItem course={item} /></option> })}
                        </select>

                        {errors.courseId && touched.courseId && (
                            <div className="input-feedback">{errors.courseId}</div>
                        )}


                        <button type="submit" disabled={isSubmitting}>
                            הוסף      </button>

                    </form>
                );

            }}
        </Formik>
        );
    </div>
}