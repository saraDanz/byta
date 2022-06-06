import "./AddTeacher.css";
import React from "react";

import { Formik } from "formik";
// import * as EmailValidator from "email-validator";
// import * as Yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { saveUser } from "./store/actions"
import { BASE_URL } from "./VARIABLES";
export default function AddTeacher() {
    let dispatch = useDispatch();
    let navigate = useNavigate();
    return <div className="add-user">
        <Formik
            initialValues={{ tz: "", firstName: "", lastName: "", address: "", phone: "", password: "", role: 1 }}
            onSubmit={(values, { setSubmitting }) => {

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

                            value={values.tz}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.tz && touched.tz && "error"}
                        />
                        {errors.tz && touched.tz && (
                            <div className="input-feedback">{errors.tz}</div>
                        )}

                        <label htmlFor="firstName">שם פרטי</label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"

                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.firstName && touched.firstName && "error"}
                        />
                        {errors.firstName && touched.firstName && (
                            <div className="input-feedback">{errors.firstName}</div>
                        )}
                        <label htmlFor="lastName">שם משפחה</label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"

                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.lastName && touched.lastName && "error"}
                        />
                        {errors.lastName && touched.lastName && (
                            <div className="input-feedback">{errors.lastName}</div>
                        )}
                        <label htmlFor="address">כתובת</label>
                        <input
                            id="address"
                            name="address"
                            type="text"

                            value={values.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.address && touched.address && "error"}
                        />
                        {errors.address && touched.address && (
                            <div className="input-feedback">{errors.address}</div>
                        )}
                        <label htmlFor="phone">טלפון</label>
                        <input
                            id="phone"
                            name="phone"
                            type="text"

                            value={values.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.phone && touched.phone && "error"}
                        />
                        {errors.phone && touched.phone && (
                            <div className="input-feedback">{errors.phone}</div>
                        )}
                        <label htmlFor="email">מייל</label>
                        <input
                            id="email"
                            name="email"
                            type="text"

                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.email && touched.email && "error"}
                        />
                        {errors.email && touched.email && (
                            <div className="input-feedback">{errors.email}</div>
                        )}
                        <label htmlFor="password">סיסמא</label>
                        <input
                            id="password"
                            name="password"
                            type="password"

                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.password && touched.password && "error"}
                        />
                        {errors.password && touched.password && (
                            <div className="input-feedback">{errors.password}</div>
                        )}

                        <label htmlFor="lastName">תפקיד</label>
                        <select
                            id="role"
                            name="role"
                            value={values.role}
                            onChange={handleChange}
                            onBlur={handleBlur}>
                            <option value="1">מורה
                            </option>
                            <option value='2'>
                                רכזת</option>
                        </select>
                        <button type="submit" disabled={isSubmitting}>
                            הוסף
      </button>

                    </form>
                );

            }}
        </Formik>
        );
    </div>
}