import "./Login.css";
import React, { useState } from "react";
import { setStorage, removeStorage } from "./storageUtils";
import { Formik } from "formik";
// import * as EmailValidator from "email-validator";
// import * as Yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { saveUser, saveCoursesOfCurrentUser } from "./store/actions"
import { BASE_URL } from "./VARIABLES";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
    Typography
    , IconButton, InputAdornment, FormControl, InputLabel, OutlinedInput, Button, Box, Card, TextField, Paper
} from "@mui/material";

import * as Yup from "yup";

const loginSchema = Yup.object().shape({
    tz: Yup.string()
        .min(8, 'תז חייבת להכיל 9 ספרות')
        .max(9, 'תז חייבת להכיל 9 ספרות')
        .required('שדה חובה').matches(/^\d+$/, "מספר זהות מכיל רק ספרות"),
    //    email: Yup.string()
    //      .email('כתובת ')
    //      .required('Required'),
    password: Yup.string()
        .required("שדה חובה")
        .min(4, "סיסמא חייבת להכיל לפחות 4 תווים")
        .max(16, "סיסמא יכולה להכיל לכל היותר 16 תווים")
});

export default function Login() {
    let dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    let navigate = useNavigate();
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return <div className="login">
        <Formik
            validationSchema={loginSchema}
            initialValues={{ tz: "", password: "" }}
            onSubmit={(values, { setSubmitting }) => {

                axios.post(BASE_URL + "users/login", values).then(res => {
                    console.log(res)
                    console.log("Logging in", values);
                    let result = window.confirm("רכזת  יקרה!\n האם תרצי לבצע כניסה כמרצה?")
                    if (result) {
                        res.data.role = 4;
                    }
                    dispatch(saveUser(res.data))

                    setSubmitting(false);
                    setStorage(res.data)

                    if (res.data.role == 1 || res.data.role == 4)
                        navigate("/displayCalendar")
                    else if (res.data.role == 2)
                        navigate("/tableDirector")
                    else if (res.data.role == 3)
                        navigate("/tableManager")


                }).catch(err => {
                    console.log(err);

                    // alert("התרחשה תקלה בהתחברות");
                    alert("שגיאה באחד מפרטי הזיהוי");
                    removeStorage()
                    setSubmitting(false);
                })

            }}

            validate={values => {
                let errors = {};
                if (!values.tz) {
                    errors.tz = "שדה חובה";
                }
                // else if (!/^[0-9]$/.test(values.tz)) {
                //     errors.tz = "מספר זהות יכול להכיל רק ספרות";
                // }
                else if (values.tz.length < 8) {
                    errors.tz = "תעודת זהות חייבת להכיל 9 ספרות";
                }
                // else if (!EmailValidator.validate(values.email)) {
                //     errors.email = "Invalid email address.";
                // }

                const passwordRegex = /(?=.*[0-9])/;
                if (!values.password) {
                    errors.password = "שדה חובה";
                    // } else if (values.password.length < 8) {
                    //     errors.password = "סיסמא לפחות 8 תווים";
                }
                else if (!passwordRegex.test(values.password)) {
                    errors.password = "סיסמא חייבת להכיל ספרה";
                }

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
                        <Paper sx={{ width: "60ch", margin: "auto", mt: 7, padding: "20px" }}>

                            <Typography variant="h6" sx={{ m: 1 }} align="center">כניסה</Typography>

                            <Box sx={{ display: "flex", flexDirection: "column", 'flexWrap': 'wrap', "justifyContent": "center", "alignItems": "center" }}>


                                <TextField
                                    sx={{ m: 1, width: '25ch' }}
                                    id="tz"
                                    name="tz"
                                    type="text"
                                    label="מספר זהות"
                                    value={values.tz}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.tz && touched.tz}
                                    helperText={errors.tz}
                                    className={errors.tz && touched.tz && "error"}
                                />


                                <TextField
                                    sx={{ m: 1, width: '25ch' }}
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    label="סיסמא"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton

                                                    onClick={() => { setShowPassword(!showPassword); }}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    className={errors.password && touched.password && "error"}

                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    error={errors.password && touched.password}
                                    helperText={errors.password}
                                    className={errors.password && touched.password && "error"}
                                />


                                <Button type="submit" variant="outlined" sx={{ m: 1 }} disabled={isSubmitting}>
                                    הכנס
      </Button>
                            </Box>
                        </Paper>

                    </form>
                );

            }}
        </Formik>
        );
    </div>
}