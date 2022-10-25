import "./AddReportFormNot.css";
import React, { useEffect, useState, useRef } from "react";
import { Radio, RadioGroup, CircularProgress, FormControlLabel } from "@mui/material";
import { Formik } from "formik";
// import * as EmailValidator from "email-validator";
// import * as Yup from "yup";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { saveUser } from "./store/actions"
import { BASE_URL } from "./VARIABLES";
import { getDayByNumber, calculateLessons } from "./Utils";
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


import * as Yup from "yup";

const reportSchema = Yup.object().shape({

    course: Yup.string()
        .required('שדה חובה'),
    fromTime: Yup.string()
        .min(3, 'שם קצר מדי')
        .required('שדה חובה'),

    toTime: Yup.string()
        .required("שדה חובה")
        .min(8, 'מספר זהות חייב להכיל 9 ספרות')
        .max(9, 'תז חייבת להכיל 9 ספרות')
        .matches(/^\d+$/, "מספר זהות מכיל רק ספרות"),

    numHours: Yup.number().min(0.1, 'שיעור קצר מדי'),
    type: Yup.string().required("שדה חובה"),
    comment: Yup.string(),


});
export default function AddReportDialog({ onClose, addReport, selectInfo }) {
    const formikRef = useRef();
    // let [numHours, setNumHours] = useState(1);
    let courses = useSelector(st => st.index.courses);
    useEffect(() => {

    }, []);
    const updateNumHours = (fromTime, toTime) => {
        if (fromTime && toTime) {

            // setNumHours(calculateLessons(new Date("2000/10/1 " + fromTime), new Date("2000/10/1 " + toTime)))
            return (calculateLessons(new Date("2000/10/1 " + fromTime), new Date("2000/10/1 " + toTime)))

        }
        return 0;
    }
    useEffect(() => {
        setIsLoading(false);
    }, [courses])
    useEffect(() => { })
    const [isLoading, setIsLoading] = useState(true);
    return <div className="add-report-form-not">


        <Formik

            innerRef={formikRef}
            initialValues={{
                course: 0,
                fromTime: 0,
                toTime: 0,
                numHours: 0, type: "distance", comment: ""
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
                    <form id="myForm" onSubmit={handleSubmit} >
                        <Dialog dir="rtl" scroll="body" open={true} onClose={onClose} >
                            <DialogTitle >
                                <Typography variant="h6" align="center">פרטי דווח חדש</Typography>
                            </DialogTitle>
                            <DialogContent >
                                <DialogContentText sx={{ textAlign: "center", m: 1 }}>
                                    <Typography variant="color.secondary" align="center">יום {getDayByNumber(selectInfo.start.getDay()) + "'"} תאריך {selectInfo.start.toLocaleDateString()}</Typography>
                                </DialogContentText>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>

                                    {isLoading ? <CircularProgress /> :
                                        <FormControl sx={{ m: 1, width: '25ch' }}>
                                            <InputLabel id="demo-simple-select-autowidth-label">תפקיד</InputLabel>

                                            <Select
                                                labelId="demo-simple-select-autowidth-label"
                                                id="demo-simple-select-autowidth"
                                                value={values.course}
                                                onChange={handleChange}
                                                autoWidth
                                                label="קורס"
                                                name="course"

                                            >
                                                {courses.map((item, index) => { return <MenuItem value={index} key={item.courseId._id}>  {item.courseId.name}</MenuItem> })}

                                            </Select> </FormControl>}
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
                                            setFieldValue("numHours", updateNumHours(e.target.value, values.toTime));
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
                                            setFieldValue("numHours", updateNumHours(values.fromTime, e.target.value));
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