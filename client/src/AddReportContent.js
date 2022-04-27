import "./AddReportFormNot.css";

import { Formik } from "formik";
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import { useSelector } from "react-redux";

export default function AddReportContent  (props)  {
    let courses = useSelector(st => st.courses);
    return (<Formik
        initialValues={{
            course: { name: "www", id: 1 },
            fromTime: 0,
            toTime: 0,
            numHours: 1,
        }}
        onSubmit={(values, { setSubmitting }) => {
            alert("sss")
            console.log(values)
            let { course, ...details } = values;
            console.log(course)
            details = { ...details, course: { id: courses[course].courseId._id, name: courses[course].courseId.name } }
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
                handleSubmit
            } = props;

            return (
                <div className="add-report-form-not">
                    <form onSubmit={handleSubmit}>


                        <label htmlFor="course">קוד קורס</label>
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
                        <label htmlFor="numHours">עד שעה</label>
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



                        <Button color='green' type={"submit"} inverted  >
                            <Icon name='checkmark' /> שמור
      </Button>


                    </form>
                </div>
            );


        }}
    </Formik>)

}