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
import {
    Dialog,
    TextField,
    Button,
    DialogActions,
    DialogTitle,
    DialogContentText,
    DialogContent
} from '@mui/material';
import "./EditCourseDialog.css"
import {
    IconButton, InputAdornment, OutlinedInput, FormControl, InputLabel,
    Box, MenuItem, Typography, Autocomplete, Select
} from "@mui/material";


import { convertToTime } from "./Utils";
export default function AddReportDialog({ onClose, addReport,selectInfo }) {

    let courses = useSelector(st => st.index.courses);


    return <div className="add-report-form-not">


        <Formik
            initialValues={{
                course: 0,
                fromTime: 0,
                toTime: 0,
                numHours: 1, type: "", comment: ""
            }}
            onSubmit={(values, { setSubmitting }) => {
                console.log(values)
                if (values.type == "")
                    return;
                let { course, ...details } = values;
                console.log(course)
                details = {
                    ...details,
                    course: {
                        _id: courses[course].courseId._id,
                        name: courses[course].courseId.name,
                    },
                    fromTime: convertToTime(details.fromTime),
                    toTime: convertToTime(details.toTime),
                }
                console.log(details)

                // details = { ...details }
                addReport(details)
                onClose()
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
                    <form id="myForm" onSubmit={handleSubmit}>
                        <Dialog dir="rtl" scroll="body" open={true} onClose={onClose} >
                            <DialogTitle >
                             <Typography variant="h6" align="center">פרטי דווח חדש</Typography>
                            </DialogTitle>
                            <DialogContent >
                                <DialogContentText sx={{textAlign:"center"}}>
                                <Typography variant="color.secondary" align="center">יום {selectInfo.start.getDay()} תאריך {selectInfo.start.toLocaleDateString()}</Typography>
                                </DialogContentText>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>


                                    <Select
                                        labelId="demo-simple-select-autowidth-label"
                                        id="demo-simple-select-autowidth"
                                        value={values.course}
                                        onChange={handleChange}
                                        autoWidth
                                        label="קורס"
                                        name="course"
                                        sx={{ m: 1, width: '25ch' }}
                                    >
                                        {courses.map((item, index) => { return <MenuItem value={index} key={item.courseId._id}>  {item.courseId.name}</MenuItem> })}

                                    </Select>
                                    <TextField
                                        id="numHours"
                                        name="numHours"
                                        type="number"
                                        placeholder="הקש מספר שעורים"
                                        value={values.numHours}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={errors.numHours && touched.numHours && "error"}
                                        label="מספר שעורים"

                                        sx={{ m: 1, width: '25ch' }}
                                    />
                                    <TextField
                                        label="משעה"
                                        id="fromTime"
                                        name="fromTime"
                                        type="time"
                                        placeholder="הקש שעת התחלה"
                                        value={values.fromTime}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={errors.fromTime && touched.fromTime && "error"}
                                        sx={{ m: 1, width: '25ch' }}
                                    />
                                    <TextField
                                        label="עד שעה"
                                        id="toTime"
                                        name="toTime"
                                        type="time"
                                        placeholder="הקש שעת סיום"
                                        value={values.toTime}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        sx={{ m: 1, width: '25ch' }}
                                        className={errors.toTime && touched.toTime && "error"} sx={{ m: 1, width: '25ch' }}
                                    />


                                    <RadioGroup

                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="controlled-radio-buttons-group"
                                        value={values.type}
                                        row
                                        sx={{ m: 1, width: '25ch' }}
                                        onChange={(e) => { setFieldValue("type", e.target.value) }}
                                    >
                                        <FormControlLabel value="frontal" control={<Radio />} label="פרונטלי" />
                                        <FormControlLabel value="distance" control={<Radio />} label="למידה מרחוק" />
                                    </RadioGroup>
                                    <TextField
                                        id="comment"
                                        name="comment"
                                        type="text"
                                        label="הערה"
                                        value={values.comment}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        sx={{ m: 1, width: '25ch' }}
                                    />


                                </Box>

                            </DialogContent>
                            <DialogActions>
                                <Button onClick={onClose}  >בטל</Button>
                                <Button type="submit" form="myForm">שמור</Button>
                            </DialogActions>
                        </Dialog>
                    </form>






                );


            }}
        </Formik>

    </div>
}