import "./AddReportFormNot.css";
import React, { useEffect } from "react";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { Formik } from "formik";
// import * as EmailValidator from "email-validator";
// import * as Yup from "yup";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { saveUser } from "./store/actions"
import { BASE_URL } from "./VARIABLES";
// import { Dialog } from '@mui/material';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import{ DialogTitle,Button }from '@mui/material';
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
export default function AddReportForm(props) {
    // let dispatch = useDispatch();
    // let courses;
    let courses = useSelector(st => st.courses);
    // let currentUser = useSelector(st => st.currentUser);
    // useEffect(() => {
    //     console.log(currentUser,"currentUser")
    // }, []);

    return <div className="add-report-form-not">


        <Modal

            onClose={props.onClose}
            open={true}
            size='small'
            trigger={<Button>Basic Modal</Button>}
        >
            <Header icon>

                <Icon name='calendar check outline' size="small" color='teal' />
                פרטי דווח
            </Header>
            <Modal.Content>
                <Formik
                    initialValues={{
                        course: 0,
                        fromTime: 0,
                        toTime: 0,
                        numHours: 1,type:"frontal",comment:""
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        //  alert("sss")
                        
                        console.log(values)
                        let { course, ...details } = values;
                        console.log(course)
                        details = { ...details, course: { id: courses[course].courseId._id, name: courses[course].courseId.name } }

                        // details = { ...details }
                        props.addReport(details)
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
                            handleSubmit,setFieldValue 
                        } = props;

                        return (
                            <form className="add-report-form-not" onSubmit={handleSubmit}>


                                <label htmlFor="course"> קורס</label>
                                <select
                                    id="course"
                                    name="course"

                                    placeholder="הקש קוד קורס"
                                    value={values.course}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={errors.course && touched.course && "error"}
                                >
                                    {courses.map((item, index) => { return <option value={index} key={item.courseId._id}>{item.courseId.name}</option> })}
                                </select>
                                {errors.course && touched.course && (
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
                                <label htmlFor="numHours">מספר שעורים</label>
                                <input
                                    id="numHours"
                                    name="numHours"
                                    type="number"
                                    placeholder="הקש מספר שעות"
                                    value={values.numHours}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={errors.numHours && touched.numHours && "error"}
                                />
                                {errors.numHours && touched.numHours && (
                                    <div className="input-feedback">{errors.numHours}</div>
                                )}
                                <RadioGroup
                                
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={values.type}
                                    row
                                    onChange={(e)=>{setFieldValue("type",e.target.value)}}
                                >
                                    <FormControlLabel value="frontal" control={<Radio />} label="פרונטלי" />
                                    <FormControlLabel value="distance" control={<Radio />} label="למידה מרחוק" />
                                </RadioGroup>
                                <label htmlFor="fromTime">הערה</label>
                                <input
                                    id="comment"
                                    name="comment"
                                    type="text"
                                    
                                    value={values.comment}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                
                                    />
            

                                <Button type={"submit"}   >
                                    <Icon name='checkmark' /> שמור
                                </Button>


                            </form>

                        );


                    }}
                </Formik>


            </Modal.Content>



        </Modal>
    </div>
}