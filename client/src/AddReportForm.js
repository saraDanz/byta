import "./Login.css";
import React from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Formik } from "formik";
// import * as EmailValidator from "email-validator";
// import * as Yup from "yup";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { saveUser } from "./store/actions"
import { BASE_URL } from "./VARIABLES";
export default function AddReportForm(props) {
    // let dispatch = useDispatch();
    // let courses;
    let courses = useSelector(st => st.index.courses);


    return <div className="add-report-form">


        <Formik
            initialValues={{
                courseId: null,
                fromTime: null,
                toTime: null,
                numHours: 1,
            }}
            onSubmit={(values, { setSubmitting }) => {
                console.log(values)
                props.addReport(values)
                props.onClose()
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
                    handleSubmit
                } = props;

                return (
                    // <form onSubmit={handleSubmit}>
                    <Dialog open={true} onClose={props.onClose}>
                        <DialogTitle>דווח</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                הקישי את כל פרטי הדווח
              </DialogContentText>
                            <label htmlFor="courseId">מספר זהות</label>
                            <select
                                id="courseId"
                                name="courseId"
                                type="text"
                                placeholder="הקש קוד קורס"
                                value={values.courseId}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={errors.courseId && touched.courseId && "error"}
                            >
                                {courses.map(item => { return <option value={item._id} key={item._id}>{item.name}</option> })}
                            </select>
                            {errors.courseId && touched.courseId && (
                                <div className="input-feedback">{errors.courseId}</div>
                            )}

                            <label htmlFor="fromTime">משעה</label>
                            <input
                                id="fromTime"
                                name="fromTime"
                                type="time"
                                placeholder="הקש שעת התחלה"
                                value={values.fromTime}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={errors.fromTime && touched.fromTime && "error"}
                            />
                            {errors.fromTime && touched.fromTime && (
                                <div className="input-feedback">{errors.fromTime}</div>
                            )}

                            <label htmlFor="toTime">עד שעה</label>
                            <input
                                id="toTime"
                                name="toTime"
                                type="time"
                                placeholder="הקש שעת סיום"
                                value={values.toTime}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={errors.toTime && touched.toTime && "error"}
                            />
                            {errors.toTime && touched.toTime && (
                                <div className="input-feedback">{errors.toTime}</div>
                            )}
                            <label htmlFor="numHours">עד שעה</label>
                            <input
                                id="numHours"
                                name="numHours"
                                type="time"
                                placeholder="הקש מספר שעות"
                                value={values.numHours}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={errors.numHours && touched.numHours && "error"}
                            />
                            {errors.numHours && touched.numHours && (
                                <div className="input-feedback">{errors.numHours}</div>
                            )}
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Email Address"
                                type="email"
                                fullWidth
                                variant="standard"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={props.onClose}>ביטול</Button>
                            {/*<Button onClick={handleClose}>save</Button>*/}
                            <button type="submit" disabled={isSubmitting}>
                                שמור      </button>
                        </DialogActions>
                    </Dialog>



                    // </form>
                );

            }}
        </Formik>
        );
    </div>
}