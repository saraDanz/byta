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
        .required('שדה חובה'),

    toTime: Yup.string()
        .required("שדה חובה")
    ,

    numHours: Yup.number().when(["fromTime", "toTime"], (fromTime, toTime, Scme) => {
        if (fromTime && toTime) return Scme.positive("סיום השיעור יהיה רק אחרי התחלתו")
    }),
    type: Yup.string().required("שדה חובה"),
    comment: Yup.string()


});
export default function AddReportDialog({ onClose, addReport, selectInfo }) {
    // const formikRef = useRef();
    // let [numHours, setNumHours] = useState(1);
    let courses = useSelector(st => st.index.courses);
    const updateNumHours = (fromTime, toTime, courseIndex) => {
        let duration = courses[courseIndex].lessonDuration || 45;
        if (fromTime && toTime) {

            // setNumHours(calculateLessons(new Date("2000/10/1 " + fromTime), new Date("2000/10/1 " + toTime)))
            return (calculateLessons(new Date("2000/10/1 " + fromTime), new Date("2000/10/1 " + toTime), duration))

        }
        return 0;
    }
    useEffect(() => {
        setIsLoading(false);
    }, [courses])
    // useEffect(() => { })
    const [isLoading, setIsLoading] = useState(true);
    return <div className="add-report-form-not">


        <Formik

            // innerRef={formikRef}
            initialValues={{
                course: 0,
                fromTime: undefined,
                toTime: undefined,
                numHours: 0, type: "frontal", comment: ""
            }}

            validationSchema={reportSchema}
            onSubmit={(values, { setSubmitting }) => {
                console.log(values)
                if (values.type == "")
                    return;
                let { course, ...details } = values;
                console.log(course)
                details = {
                    ...details,
                    course: {
                        _id: courses[course]._id,
                        name: courses[course].name,
                    },
                    fromTime: convertToTime(details.fromTime),
                    toTime: convertToTime(details.toTime),
                }
                console.log(details)

                // details = { ...details }
                let result = addReport(details)
                if (result)
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
                    handleSubmit, setFieldValue, setFieldError
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
                                            <InputLabel id="demo-simple-select-autowidth-label">שם קורס</InputLabel>

                                            <Select
                                                labelId="demo-simple-select-autowidth-label"
                                                id="demo-simple-select-autowidth"
                                                value={values.course}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    // updateNumHours(values.fromTime,values.toTime,values.course);
                                                    setFieldValue("numHours", updateNumHours(values.fromTime, values.toTime, e.target.value));
                                                }}
                                                autoWidth
                                                label="קורס"
                                                name="course"
                                                error={(errors.course && touched.course)}
                                                helperText={touched.course && errors.course ? errors.course : " "}

                                            >
                                                {courses.map((item, index) => { return <MenuItem value={index} key={item._id}>  {item.name+"-"+item.description}</MenuItem> })}

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
                                            setFieldValue("numHours", updateNumHours(e.target.value, values.toTime, values.course));
                                            // if ( values.toTime && e.target.value>values.toTime)
                                            // setFieldError("toTime", "שעת סיום חייבת להיות אחרי שעת התחלה")

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
                                            setFieldValue("toTime", e.target.value, false)
                                            setFieldValue("numHours", updateNumHours(values.fromTime, e.target.value, values.course));
                                            // if (values.fromTime  && values.fromTime > e.target.value)
                                            // setFieldError("toTime", "שעת סיום חייבת להיות אחרי שעת התחלה")
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
