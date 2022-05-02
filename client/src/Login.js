import "./Login.css";
import React from "react";
import {setStorage, removeStorage} from "./storageUtils";
import { Formik } from "formik";
// import * as EmailValidator from "email-validator";
// import * as Yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { saveUser } from "./store/actions"
import { BASE_URL } from "./VARIABLES";
export default function Login() {
    let dispatch = useDispatch();
    let navigate = useNavigate();
    return <div className="login">
        <Formik
            initialValues={{ tz: "", password: "" }}
            onSubmit={(values, { setSubmitting }) => {

                axios.post(BASE_URL+"users/login", values).then(res => {
                    console.log(res)
                    console.log("Logging in", values);
                    dispatch(saveUser(res.data))
                    setSubmitting(false);
                    setStorage(res.data)

                    if (res.data.role == 1)
                        navigate("/report")
                    else
                        navigate("/director")


                }).catch(err => {
                    console.log(err);

                    // alert("התרחשה תקלה בהתחברות");
                    alert("שגיאה באח מפרטי הזיהוי");
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
                else if (values.tz.length < 9) {
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
                } else if (!passwordRegex.test(values.password)) {
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

                        <label htmlFor="tz">מספר זהות</label>
                        <input
                            id="tz"
                            name="tz"
                            type="text"
                            placeholder="הקש תז"
                            value={values.tz}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.tz && touched.tz && "error"}
                        />
                        {errors.tz && touched.tz && (
                            <div className="input-feedback">{errors.tz}</div>
                        )}

                        <label htmlFor="password">סיסמא</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="הקש סיסמא"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.password && touched.password && "error"}
                        />
                        {errors.password && touched.password && (
                            <div className="input-feedback">{errors.password}</div>
                        )}

                        <button type="submit" disabled={isSubmitting}>
                            כניסה
      </button>

                    </form>
                );

            }}
        </Formik>
        );
    </div>
}