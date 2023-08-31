import "./AddReportFormNot.css";
import React, { useEffect, useState, useRef } from "react";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { Formik } from "formik";
import { calculateLessons } from "./Utils";

// import * as EmailValidator from "email-validator";
// import * as Yup from "yup";
import axios from "axios";
import { getDayByNumber } from "./Utils";

import * as Yup from "yup";

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


import { convertToTime, dateStringToTimeString } from "./Utils";


const reportSchema = Yup.object().shape({

    course: Yup.string()
        .required('שדה חובה'),
    fromTime: Yup.string()
        .required('שדה חובה'),

    toTime: Yup.string()
        .required("שדה חובה")
    ,
    numHours: Yup.number().when(["fromTime", "toTime"], (fromTime, toTime, Scme) => {
        if (fromTime && toTime) return Scme.positive("סיום השיעור יהיה רק אחרי התחלתו")
    }),
    numHours: Yup.number(),
    type: Yup.string().required("שדה חובה"),
    comment: Yup.string(),
});

export default function EditReportDialog({ onClose, event, handleEditSave }) {
    // let dispatch = useDispatch();
    // let courses; 

    const updateNumHours = (fromTime, toTime, courseIndex) => {
        let duration = courses[courseIndex].lessonDuration || 45;
        if (fromTime && toTime) {

            // setNumHours(calculateLessons(new Date("2000/10/1 " + fromTime), new Date("2000/10/1 " + toTime)))
            let x = (calculateLessons(new Date("2000/10/1 " + fromTime), new Date("2000/10/1 " + toTime), duration))
            return x;

        }
        return 0;
    }
    const [changed, setChanged] = useState(false);
    const formikRef = useRef();
    let courses = useSelector(st => st.index.courses);
    // let currentUser = useSelector(st => st.currentUser);
    useEffect(() => {
        // console.log(event, "event")
        let ind = courses.findIndex(o => {
            if (o._id == event.event.extendedProps.courseId._id)
                return true;
            return false;
        });
        // setIndex(ind);
        if (formikRef.current) {
            formikRef.current.setFieldValue(
                "course",
                ind
            );
        }
    }, [courses]);

    return <div className="add-report-form-not">


        <Formik
            validationSchema={reportSchema}
            innerRef={formikRef}
            initialValues={
                /*event.event.extendedProps._id ? {
                course: 0,
                fromTime: 0,
                toTime: 0,
                numHours: 1, type: "frontal", comment: ""
            } : */{
                    course: 0,
                    fromTime: dateStringToTimeString(event.event.extendedProps.fromTime),
                    toTime: dateStringToTimeString(event.event.extendedProps.toTime),
                    numHours: event.event.extendedProps.numHours,
                    type: event.event.extendedProps.type,
                    comment: event.event.extendedProps.comment

                }}
            onSubmit={(values, { setSubmitting }) => {
                //alert("sss")

                //  console.log(values)
                let { course, ...details } = values;
                //  console.log(course)
                details = {
                    ...details,
                    course: {
                        _id: courses[course]._id,
                        name: courses[course].name,
                    },
                    fromTime: convertToTime(details.fromTime),
                    toTime: convertToTime(details.toTime),
                }
                //      console.log(details)

                // details = { ...details }
               

                let result =  handleEditSave(details)
                if (result)
                    onClose();
               
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
                            <DialogTitle  > <Typography variant="h6" align="center">עדכון פרטי דווח</Typography></DialogTitle>
                            <DialogContent >
                                <DialogContentText sx={{ textAlign: "center" }}>
                                    <Typography variant="color.secondary" align="center">יום {getDayByNumber(event.event.start.getDay()) + "'"} תאריך {event.event.start.toLocaleDateString()}</Typography>

                                </DialogContentText>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>


                                    <Select
                                        labelId="demo-simple-select-autowidth-label"
                                        id="demo-simple-select-autowidth"
                                        value={values.course}
                                        onChange={(e) => {
                                            handleChange(e);
                                            // updateNumHours(values.fromTime,values.toTime,values.course);
                                            setFieldValue("numHours", updateNumHours(values.fromTime, values.toTime, e.target.value));
                                        }

                                        }

                                        autoWidth
                                        label="קורס"
                                        name="course"
                                        sx={{ m: 1, width: '25ch' }}
                                    >
                                        {courses.map((item, index) => { return <MenuItem value={index} key={item._id}>  {item.name+"-"+item.description}</MenuItem> })}

                                    </Select>

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


                                    <TextField
                                        label="משעה"
                                        id="fromTime"
                                        name="fromTime"
                                        type="time"
                                        placeholder="הקש שעת התחלה"
                                        value={values.fromTime}
                                        onChange={(e) => {
                                            setFieldValue("fromTime", e.target.value)
                                            setFieldValue("numHours", updateNumHours(e.target.value, values.toTime, values.course));
                                        }}
                                        onBlur={handleBlur}
                                        className={errors.fromTime && touched.fromTime && "error"}
                                        sx={{ m: 1, width: '19ch' }}
                                        error={(errors.fromTime && touched.fromTime)}
                                        helperText={touched.fromTime && errors.fromTime ? errors.fromTime : " "}

                                    />
                                    <TextField
                                        label="עד שעה"
                                        id="toTime"
                                        name="toTime"
                                        type="time"
                                        placeholder="הקש שעת סיום"
                                        value={values.toTime}
                                        onChange={(e) => {
                                            setFieldValue("toTime", e.target.value)
                                            setFieldValue("numHours", updateNumHours(values.fromTime, e.target.value, values.course));
                                        }}
                                        onBlur={handleBlur}
                                        error={(errors.toTime && touched.toTime)}
                                        helperText={touched.toTime && errors.toTime ? errors.toTime : " "}

                                        sx={{ m: 1, width: '19ch' }}
                                        className={errors.toTime && touched.toTime && "error"}
                                    />
                                    <TextField
                                        id="numHours"
                                        name="numHours"


                                        value={values.numHours}

                                        onBlur={handleBlur}
                                        className={errors.numHours && touched.numHours && "error"}
                                        label="מספר שעורים"

                                        sx={{ m: 1, width: '10ch' }}
                                        error={(errors.numHours)}
                                        helperText={errors.numHours ? errors.numHours : " "}

                                    />

                                    <RadioGroup

                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="controlled-radio-buttons-group"
                                        value={values.type}
                                        row
                                        sx={{ m: 1, width: '40ch' }}
                                        onChange={(e) => { setFieldValue("type", e.target.value) }}
                                    >
                                        <FormControlLabel value="frontal" control={<Radio />} label="פרונטלי" />
                                        <FormControlLabel value="distance" control={<Radio />} label="למידה מרחוק" />
                                        <FormControlLabel value="absence" control={<Radio />} label="היעדרות" />

                                    </RadioGroup>
                                    {/*<TextField
                                        id="numHours"
                                        label="מספר שיעורים"
                                        name="numHours"
                                        type="number"

                                        value={values.numHours}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={errors.numHours && touched.numHours && "error"}

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
                                        sx={{ m: 1, width: '25ch', direction: "rtl" }}
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
                                        className={errors.toTime && touched.toTime && "error"}
                                        sx={{ m: 1, width: '25ch' }}

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
                                    />/* }

                                    {/*} <FormControl sx={{ m: 1 }}>
                                    <TextField
                                      id="outlined-select-currency"
                                      select
                                      label="תפקיד"
                                      name="role"
            
                                      value={values.role}
                                      onChange={handleChange}
                                    >
                                      {roles.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                          {option.label}
                                        </MenuItem>
                                      ))}
                                    </TextField>
                                      </FormControl>*/}
                                    {/* <Autocomplete
                                    //     disablePortal
                                    //     id="combo-box-demo"
                                    //     options={directors}
                                    //     defaultValue={values.directorId}
                                    //     sx={{ width: 300 }}
                                    //     getOptionLabel={(option) => option.firstName + " " + option.lastName}
                                    //     onChange={(event, newValue) => {
                                    //         console.log(newValue)
                                    //         if (newValue)
                                    //             setFieldValue("directorId", newValue._id)
                                    //         //  setValue(newValue);
                                    //     }}

                                        // onInputChange={(event, newInputValue) => {
                                        //   console.log(newInputValue,"input value")

                                        // setInputValue(newInputValue);
                                        // }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />*/}
                                </Box>

                            </DialogContent>
                            <DialogActions>
                                <Button onClick={onClose} >בטל</Button>
                                <Button type="submit" form="myForm" color="secondary">שמור</Button>
                            </DialogActions>
                        </Dialog>
                    </form>

                    // <form className="add-report-form-not" onSubmit={handleSubmit}>


                    //     <label htmlFor="course"> קורס</label>
                    //     <select
                    //         id="course"
                    //         name="course"

                    //         placeholder="הקש קוד קורס"
                    //         value={values.course}
                    //         onChange={handleChange}
                    //         onBlur={handleBlur}
                    //         className={errors.course && touched.course && "error"}
                    //     >
                    //         {courses.map((item, index) => { return <option value={index} key={item.courseId._id}>{item.courseId.name}</option> })}
                    //     </select>
                    //     {errors.course && touched.course && (
                    //         <div className="input-feedback">{errors.courseId}</div>
                    //     )}



                    //     {errors.fromTime && touched.fromTime && (
                    //         <div className="input-feedback">{errors.fromTime}</div>
                    //     )}


                    //     {errors.toTime && touched.toTime && (
                    //         <div className="input-feedback">{errors.toTime}</div>
                    //     )}
                    //     <label htmlFor="numHours">מספר שעורים</label>
                    //     <input
                    //     />
                    //     {errors.numHours && touched.numHours && (
                    //         <div className="input-feedback">{errors.numHours}</div>
                    //     )}



                    // <Button type={"submit"}   >
                    //     <Icon name='checkmark' /> שמור
                    // </Button>


                    // </form>

                );


            }}
        </Formik>

    </div>
}