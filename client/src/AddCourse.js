import "./AddCourse.css";
import React, { useState, useEffect } from "react";

import { Formik } from "formik";

import {Paper,Box,Button,Typography} from "@mui/material";

// import * as EmailValidator from "email-validator";
// import * as Yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { saveUser } from "./store/actions"
import { BASE_URL } from "./VARIABLES";
import { Autocomplete, TextField } from "@mui/material";
export default function AddCourse() {
    let dispatch = useDispatch();
    let navigate = useNavigate();
    const [directors, setDirectors] = useState([]);
    useEffect(() => {
        axios.get(BASE_URL + "users/directors").
            then(res => {
                console.log(res.data);
                setDirectors(res.data);
            }).
            catch(err => {
                console.log(err);
                alert("תקלה בהצגת הרכזות")
            })
    }, []);
    return <div className="add-course">
        <Formik
            initialValues={{ name: "", description: "", directorId: "", symbol: "" }}
            onSubmit={(values, { setSubmitting }) => {

                if (!values.directorId && directors)
                    values.directorId = directors[0]._id;
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
                        <Typography variant="h6"  align="center">פרטי קורס חדש</Typography>

                            <Box sx={{ display: "flex", 'flexWrap': 'wrap', "justifyContent": "center", "alignItems": "center" }}>

                                <TextField
                                sx={{ m: 1, width: '25ch' }}

                                    id="name"
                                    name="name"
                                    type="text"
                                    label="שם"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={errors.name && touched.name && "error input-add-course" || "input-add-course"}
                                />
                                {errors.name && touched.name && (
                                    <div className="input-feedback">{errors.name}</div>
                                )}

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
                                    className={errors.description && touched.description && "error input-add-course" || "input-add-course"}
                                />
                                {errors.description && touched.description && (
                                    <div className="input-feedback">{errors.description}</div>
                                )}
                                <TextField
                                sx={{ m: 1, width: '25ch' }}
                                    className="input-add-course"
                                    id="symbol"
                                    name="symbol"
                                    type="text"
                                    label="סמל קורס"
                                    value={values.symbol}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={errors.symbol && touched.symbol && "error input-add-course" || "input-add-course"}
                                />
                                {errors.symbol && touched.symbol && (
                                    <div className="input-feedback">{errors.symbol}</div>
                                )}

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
                                <Autocomplete
                                 sx={{ m: 1, width: '25ch' }}
                                    disablePortal
                                    id="combo-box-demo"
                                    options={directors}
                                   
                                    getOptionLabel={(option) => option.firstName + " " + option.lastName}
                                    onChange={(event, newValue) => {
                                        console.log(newValue)
                                        if (newValue)
                                            setFieldValue("directorId", newValue._id)
                                        //  setValue(newValue);
                                    }}

                                    // onInputChange={(event, newInputValue) => {
                                    //   console.log(newInputValue,"input value")

                                    // setInputValue(newInputValue);
                                    // }}
                                    renderInput={(params) => <TextField {...params} label="רכזת קורס"/>}
                                />
                                {errors.directorId && touched.directorId && (
                                    <div className="input-feedback">{errors.directorId}</div>
                                )}

                                <Button className="button-add-course" type="submit" disabled={isSubmitting}>
                                    הוסף      </Button>
                            </Box></Paper>
                    </form>
                );

            }}
        </Formik>
        {/* ); */}
    </div>
}