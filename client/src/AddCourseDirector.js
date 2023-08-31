import "./AddCourse.css";
import React, { useState, useEffect } from "react";

import { Formik } from "formik";

import { Paper, Box, Button, Typography, Radio, RadioGroup, FormControlLabel, Stack } from "@mui/material";

// import * as EmailValidator from "email-validator";
// import * as Yup from "yup";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { saveUser } from "./store/actions"
import { BASE_URL } from "./VARIABLES";
import { Autocomplete, TextField, FormControl, FormLabel } from "@mui/material";

import * as Yup from "yup";

const courseSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, 'שם חייב להכיל לפחות 3 תווים')
        .required('שדה חובה'),

    description: Yup.string()
        .required("שדה חובה"),

    symbol: Yup.string(),
    directorId: Yup.string().required("שדה חובה")
});
export default function AddCourseDirector() {
    let dispatch = useDispatch();
    let navigate = useNavigate();
    let currentUser = useSelector(st => st.index.currentUser)

    return <div className="add-course">
        <Formik
            validationSchema={courseSchema}

            initialValues={{ name: "", description: "", directorId: currentUser ?._id, symbol: "", lessonDuration: 45 }}
            onSubmit={(values, { setSubmitting }) => {


                values.directorId = currentUser ?._id;
                axios.post(BASE_URL + "courses", values).then(res => {
                    console.log(res)
                    console.log("course added in", values);

                    setSubmitting(false);
                    alert("קורס נוסף בהצלחה");

                }).catch(err => {
                    console.log(err);

                    alert("התרחשה תקלה בהוספת קורס\n" + err);

                    setSubmitting(false);
                })

            }}

            validate={values => {
                let errors = {};
                // if (!values.tz) {
                //     errors.tz = "שדה חובה";
                // }
                // else if (!/^[0-9]$/.test(values.tz)) {
                //     errors.tz = "מספר זהות יכול להכיל רק ספרות";
                // }
                // else if (values.tz.length < 9) {
                //     errors.tz = "סיסמא חייבת להכיל 9 ספרות";
                // }
                // else if (!EmailValidator.validate(values.email)) {
                //     errors.email = "Invalid email address.";
                // }

                // const passwordRegex = /(?=.*[0-9])/;
                // if (!values.password) {
                //     errors.password = "שדה חובה";
                // } else if (values.password.length < 8) {
                //     errors.password = "סיסמא לפחות 8 תווים";
                // } else if (!passwordRegex.test(values.password)) {
                //     errors.password = "סיסמא חייבת להכיל ספרה";
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
                            <Typography variant="h6" align="center">פרטי קורס חדש</Typography>

                            <Box sx={{ display: "flex", 'flexWrap': 'wrap', "justifyContent": "center", "alignItems": "center" }}>

                              <Stack direction="row" >  <TextField
                                    sx={{ m: 1, width: '25ch' }}

                                    id="name"
                                    name="name"
                                    type="text"
                                    label="שם"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.name && touched.name}
                                    helperText={errors.name}
                                />


                                <TextField
                                    sx={{ m: 1, width: '25ch' }}
                                    className="input-add-course"
                                    id="description"
                                    name="description"
                                    type="text"
                                    label="תאור"
                                    value={values.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.description && touched.description}
                                    helperText={errors.description} />
                                    </Stack>
                                    <Stack direction="row" sx={{width:"100%"}} >

                                <TextField
                                    sx={{ m: 1, width: '25ch' }}
                                    className="input-add-course"
                                    id="symbol"
                                    name="symbol"
                                    type="text"
                                    error={errors.symbol && touched.symbol}
                                    helperText={errors.symbol}
                                    label="סמל קורס"
                                    value={values.symbol}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={errors.symbol && touched.symbol && "error input-add-course" || "input-add-course"}
                                />


                                {/* <label className="label-add-course">רכזת</label>
                                 <select
                            id="directorId"
                            name="directorId"

className="select-add-course"
                            value={values.directorId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.directorId && touched.directorId && "error"}
                        >
                            {directors.map((item) => { return <option value={item._id} key={item._id}>{item.firstName + " " + item.lastName}</option> })}
                        </select> */}
                                {/**/}   <FormControl>
                                    <FormLabel >משך שיעור </FormLabel>
                                    <RadioGroup

                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="controlled-radio-buttons-group"
                                        value={values.lessonDuration}
                                        row
                                        sx={{ m: 1, width: '40ch' }}
                                        onChange={(e) => { setFieldValue("lessonDuration", e.target.value) }}
                                    >

                                        <FormControlLabel value="45" control={<Radio />} label="45 דקות" />
                                        <FormControlLabel value="60" control={<Radio />} label="60 דקות" />

                                    </RadioGroup>
                                </FormControl></Stack>
                                <Button className="button-add-course" 
                                variant="outlined" type="submit" 
                                disabled={isSubmitting} sx={{position:"relative"}}>
                                    הוסף      </Button>
                            </Box>

                        </Paper>
                    </form>
                );

            }}
        </Formik>
        {/* ); */}
    </div>
}