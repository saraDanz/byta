import "./AddTeacherToCourse.css";
import React, { useState, useEffect } from "react";

import { Formik } from "formik";
// import * as EmailValidator from "email-validator";
// import * as Yup from "yup";
import { Paper, Box, Button, Typography } from "@mui/material";

import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { saveUser } from "./store/actions"
import { BASE_URL } from "./VARIABLES";
import { Autocomplete, TextField } from "@mui/material";

import CourseSelectListItem from "./CourseSelectListItem";
export default function AddTeacherToCourse() {
    let dispatch = useDispatch();
    const [courses, setCourses] = useState([]);
    const [defaultFare, setDefaultFare] = useState(0);
    const [teachers, setTeachers] = useState([]);
    useEffect(() => {
        axios.get(BASE_URL + "variables/fare/תעריף ברירת מחדל").then((res) => {
            setDefaultFare( res.data.value);
            console.log(res.data)

        })  .catch(err => {
                console.log(err);
                alert("תקלה בהצגת תעריף ברירת מחדל")
            })
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
        <Formik enableReinitialize
            initialValues={{ courseId: "", teacherId: "", fare: defaultFare }}
            onSubmit={(values, { setSubmitting }) => {
                if (!values.courseId && courses) values.courseId = courses[0]._id;
                if (!values.teacherId && teachers) values.teacherId = teachers[0]._id;

                axios.post(BASE_URL + "teacherCourses", values).then(res => {
                    console.log(res)
                    console.log("teacher added to course", values);
                    // dispatch(saveUser(res.data))
                    setSubmitting(false);
                    alert("המורה נוספה לקורס בהצלחה")

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
                    handleSubmit, setFieldValue
                } = props;

                return (
                    <form onSubmit={handleSubmit}>
                        <Paper sx={{ width: "60ch", margin: "auto", mt: 7, padding: "20px" }}>

                            <Typography variant="h6" align="center">הוספת מורה לקורס</Typography>

                            <Box sx={{ display: "flex", flexDirection: "column", 'flexWrap': 'wrap', "justifyContent": "center", "alignItems": "center" }}>

                                {/* <label>מורה</label> */}
                                {/* <select
                            id="teacherId"
                            name="teacherId"

                            placeholder="הקש קוד  מורה"
                            value={values.teacherId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.teacherId && touched.teacherId && "error"}
                        >
                  
                            {teachers.map((item) => { return <option value={item._id} key={item._id}>{item.firstName + " " + item.lastName}</option> })}
                        </select> */}
                                <Autocomplete
                                    disablePortal

                                    options={teachers}


                                    sx={{ m: 1, width: 300 }}
                                    getOptionLabel={(item) => item.firstName + " " + item.lastName}
                                    onChange={(event, newValue) => {
                                        debugger;
                                        console.log(newValue)
                                        if (newValue)
                                            setFieldValue("teacherId", newValue._id)

                                    }}


                                    renderInput={(params) => <TextField {...params} label="מורה" />}
                                />
                                {errors.teacherId && touched.teacherId && (
                                    <div className="input-feedback">{errors.teacherId}</div>
                                )}



                                {/* <select
                            id="courseId"
                            name="courseId"
                            placeholder="הקש קוד קורס"
                            value={values.courseId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.courseId && touched.courseId && "error"}
                        >
                     

                            {courses.map((item, index) => { return <option value={item._id} key={item._id} ><CourseSelectListItem course={item} /></option> })}
                        </select> */}
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={courses}


                                    sx={{ m: 1, width: 300 }}
                                    getOptionLabel={(course) => course.name + "-" + course.description + " - " + (course.symbol ? course.symbol : "")}
                                    onChange={(event, newValue) => {
                                        debugger;
                                        console.log(newValue)
                                        if (newValue)
                                            setFieldValue("courseId", newValue._id)

                                    }}


                                    renderInput={(params) => <TextField {...params} label="קורס" />}
                                />
                                {errors.courseId && touched.courseId && (
                                    <div className="input-feedback">{errors.courseId}</div>
                                )}


                                <TextField
                                    id="fare"
                                    name="fare"
                                    type="number"
                                    label="תעריף נסיעות"
                                    sx={{ m: 1, width: '25ch' }}
                                    value={values.fare}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={(errors.fare && touched.fare)}
                                    helperText={touched.fare && errors.fare ? errors.fare : " "}
                                    className={errors.fare && touched.fare && "error"}
                                />

                                <Button type="submit" variant="outlined" sx={{ m: 1 }} className="button-add-teacher-to-course" disabled={isSubmitting}>
                                    הוסף      </Button>
                            </Box></Paper>

                    </form>
                );

            }}
        </Formik>
        );
    </div>
}