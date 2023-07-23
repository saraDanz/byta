import "./AddTeacher.css";
import React, { useState } from "react";
import { Paper, Button, MenuItem, Typography, InputLabel, FormControl, Box, TextField, Select } from "@mui/material";
import { Formik } from "formik";
// import * as EmailValidator from "email-validator";
// import * as Yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import { BASE_URL } from "./VARIABLES";
import * as Yup from "yup";

const teacherSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(3, 'שם קצר מדי')
        .required('שדה חובה'),
    lastName: Yup.string()
        .min(3, 'שם קצר מדי')
        .required('שדה חובה'),

    tz: Yup.string()
        .required("שדה חובה")
        .min(8, 'מספר זהות חייב להכיל 9 ספרות')
        .max(9, 'תז חייבת להכיל 9 ספרות')
        .matches(/^\d+$/, "מספר זהות מכיל רק ספרות"),

    address: Yup.string().min(3, 'שם חייב קצר מדי'),
    role: Yup.string().required("שדה חובה"),
    phone: Yup.string().required("שדה חובה"),
    workerNum: Yup.string()
        .matches(/^\d+$/, "מספר עובד מכיל רק ספרות"),
    email: Yup.string().required("שדה חובה").email("מייל לא תקין"),
    password: Yup.string()
        .required("שדה חובה")
        .min(4, "סיסמא חייבת להכיל לפחות 4 תווים")
        .max(16, "סיסמא יכולה להכיל לכל היותר 16 תווים")
});
export default function AddTeacher() {
    let dispatch = useDispatch();
    let navigate = useNavigate();

    return <div className="add-user">
        <Formik
            validationSchema={teacherSchema}

            initialValues={{ tz: "", workerNum: "", firstName: "", lastName: "", address: "", phone: "", password: "", role: 1, email: "" }}
            onSubmit={(values, { setSubmitting }) => {
                //  let x= await  teacherSchema.isValid(values);
                //     if(!x)
                //     return;

                // if (Object.keys(errors).length > 0)
                //     return;
                axios.post(BASE_URL + "users", values).then(res => {
                    console.log(res)
                    console.log("user added in", values);
                    // dispatch(saveUser(res.data))
                    setSubmitting(false);

                    // if (res.data.role == 1)
                    //     navigate("/report")
                    // else
                    // navigate("/director")
                    alert("מורה נוספה בהצלחה")


                }).catch(err => {
                    console.log(err);

                    alert("התרחשה תקלה בהוספת המורה");
                    // alert("שגיאה באח מפרטי הזיהוי");
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
                //     errors.tz = "תעודת זהות חייבת להכיל 9 ספרות";
                // }
                // // else if (!EmailValidator.validate(values.email)) {
                //     errors.email = "Invalid email address.";
                // }

                // const passwordRegex = /(?=.*[0-9])/;
                // if (!values.password) {
                //     errors.password = "שדה חובה";
                //     // } else if (values.password.length < 8) {
                //     //     errors.password = "סיסמא לפחות 8 תווים";
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
                    handleSubmit,
                    setFieldValue, isValid, dirty
                } = props;

                return (
                    <form onSubmit={handleSubmit} id="myForm">
                        <Paper sx={{ width: "60ch", margin: "auto", mt: 7, padding: "20px" }}>

                            <Typography variant="h6" align="center">פרטי מורה חדשה</Typography>

                            <Box sx={{ display: "flex", 'flexWrap': 'wrap', "justifyContent": "center", "alignItems": "center" }}>

                                <TextField
                                    id="tz"
                                    name="tz"
                                    type="text"
                                    label="מספר זהות"
                                    value={values.tz}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={{ m: 1, width: '20ch' }}
                                    error={(errors.tz && touched.tz)}
                                    helperText={touched.tz && errors.tz ? errors.tz : " "}

                                    className={errors.tz && touched.tz && "error"}
                                />
                                <TextField
                                    id="tz"
                                    name="workerNum"
                                    type="text"
                                    label="מספר עובד"
                                    value={values.workerNum}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={{ m: 1, width: '17ch' }}
                                    error={(errors.workerNum && touched.workerNum)}
                                    helperText={touched.workerNum && errors.workerNum ? errors.workerNum : " "}

                                    className={errors.workerNum && touched.workerNum && "error"}
                                />
                                <FormControl sx={{ m: 1, width: '10ch' }}>
                              
                                <InputLabel id="demo-simple-select-autowidth-label">תפקיד</InputLabel>

                                    <Select
                                        id="rolrr"
                                        value={values.role}


                                        onChange={(eve) => { setFieldValue("role", eve.target.value) }}>


                                        <MenuItem value="1">
                                            <em>מורה</em>
                                        </MenuItem>
                                        <MenuItem value="2">
                                            <em>רכזת</em>
                                        </MenuItem>
                                    </Select>
                                </FormControl>



                                <TextField
                                    sx={{ m: 1, width: '25ch' }}
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    label="שם פרטי"
                                    value={values.firstName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={(errors.firstName && touched.firstName)}
                                    helperText={touched.firstName && errors.firstName ? errors.firstName : " "}
                                    className={errors.firstName && touched.firstName && "error"}
                                />


                                <TextField
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    label="שם משפחה"
                                    sx={{ m: 1, width: '25ch' }}
                                    value={values.lastName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={(errors.lastName && touched.lastName)}

                                    helperText={touched.lastName && errors.lastName ? errors.lastName : " "}

                                    className={errors.lastName && touched.lastName && "error"}
                                />


                                <TextField
                                    id="address"
                                    name="address"
                                    type="text"
                                    label="כתובת"
                                    sx={{ m: 1, width: '25ch' }}
                                    value={values.address}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={(errors.address && touched.address)}
                                    helperText={touched.address && errors.address ? errors.address : " "}
                                    className={errors.address && touched.address && "error"}
                                />


                                <TextField
                                    sx={{ m: 1, width: '25ch' }}
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    label="טלפון"
                                    value={values.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={(touched.phone && errors.phone) ? true : false}
                                    helperText={touched.phone && errors.phone ? errors.phone : " "}
                                    className={errors.phone && touched.phone && "error"}
                                />


                                <TextField
                                    sx={{ m: 1, width: '25ch' }}
                                    id="email"
                                    name="email"
                                    type="text"
                                    label="מייל"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={(touched.email && errors.email) ? true : false}
                                    helperText={touched.email && errors.email ? errors.email : " "}

                                    className={errors.email && touched.email && "error"}
                                />



                                <TextField
                                    sx={{ m: 1, width: '25ch' }}
                                    id="password"
                                    name="password"
                                    type="password"
                                    label="סיסמא"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={(touched.password && errors.password) ? true : false}
                                    helperText={touched.password && errors.password ? errors.password : " "}

                                    className={errors.password && touched.password && "error"}
                                />
                                {/**/}


                                <Button type="submit" variant="outlined" form="myForm" disabled={isSubmitting}>הוסף</Button>
                            </Box>
                        </Paper>
                    </form>
                );

            }}
        </Formik>
        );
    </div>
}