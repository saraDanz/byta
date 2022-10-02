import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


import "./EditTeacherDialog.css"
import {
  IconButton, InputAdornment, OutlinedInput, FormControl, InputLabel,
  Box, FormHelperText, MenuItem, Typography
} from "@mui/material";
import * as Yup from "yup";

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { BASE_URL } from "./VARIABLES";
import { Formik } from "formik";
import axios from "axios";
export const DisplayFormikState = props =>
  <div style={{ margin: '1rem 0', background: '#f6f8fa', padding: '.5rem' }}>
    <strong>Injected Formik props (the form's state)</strong>
    <div style={{}}>
      <code>touched:</code> {JSON.stringify(props.touched, null, 2)}
    </div>
    <div>
      <code>errors:</code> {JSON.stringify(props.errors, null, 2)}
    </div>
    <div>
      <code>values:</code> {JSON.stringify(props.values, null, 2)}
    </div>
    <div>
      <code>isSubmitting:</code> {JSON.stringify(props.isSubmitting, null, 2)}
    </div>
  </div>;

const teacherSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(3, 'שם קצר מדי')
    .required('שדה חובה'),
  lastName: Yup.string()
    .min(3, 'שם קצר מדי')
    .required('שדה חובה'),

  tz: Yup.string()
    .required("שדה חובה")
    .min(8, 'מספר זהות חייב להכיל 9 ספרות')
    .max(9, 'תז חייבת להכיל 9 ספרות')
    .matches(/^\d+$/, "מספר זהות מכיל רק ספרות"),

  address: Yup.string().min(3, 'שם חייב קצר מדי'),
  role: Yup.string().required("שדה חובה"),
  phone: Yup.string().required("שדה חובה"),
  email: Yup.string().required("שדה חובה").email("מייל לא תקין"),
  workerNum: Yup.string()
    .matches(/^\d+$/, "מספר עובד מכיל רק ספרות"),
  password: Yup.string()
    .required("שדה חובה")
    .min(4, "סיסמא חייבת להכיל לפחות 4 תווים")
    .max(16, "סיסמא יכולה להכיל לכל היותר 16 תווים")
});
export default function EditTeacherDialog({ teacher, handleClose, saveChanges }) {
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    setShowPassword(false);
  }, []);
  const handleClickShowPassword = () => {
    setShowPassword(true);
  };

  const handleMouseDownPassword = () => {
    setShowPassword(false);
  };
  const roles = [
    { value: 1, label: "מורה" },
    { value: 2, label: "רכזת" }
  ]

  return (
    <div>

      {teacher && (
        <Formik
          validationSchema={teacherSchema}

          initialValues={{ tz: teacher.tz, workerNum: teacher.workerNum, firstName: teacher.firstName, lastName: teacher.lastName, email: teacher.email, address: teacher.address, phone: teacher.phone, password: teacher.password, role: teacher.role }}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);
            axios.put(BASE_URL + "users/" + teacher._id, values).then(res => {
              console.log(res)
              console.log("user updated in", values);
              saveChanges(res.data)
              setSubmitting(false);

              alert("פרטים עודכנו בהצלחה")
            }).catch(err => {
              console.log(err);
              alert("התרחשה תקלה בעדכון פרטי מורה");
              setSubmitting(false);
            }).finally(() => { handleClose(); })

          }}

          validate={values => {
            // let errors = {};
            // if (!values.tz) {
            //   errors.tz = "שדה חובה";
            // }
            // else if (!/^[0-9]$/.test(values.tz)) {
            //     errors.tz = "מספר זהות יכול להכיל רק ספרות";
            // }
            // else if (values.tz.length < 9) {
            // errors.tz = "תעודת זהות חייבת להכיל 9 ספרות";
            // }
            // else if (!EmailValidator.validate(values.email)) {
            //     errors.email = "Invalid email address.";
            // }

            // const passwordRegex = /(?=.*[0-9])/;
            // if (!values.password) {
            //   errors.password = "שדה חובה";
            //   // } else if (values.password.length < 8) {
            //   //     errors.password = "סיסמא לפחות 8 תווים";
            // } else if (!passwordRegex.test(values.password)) {
            //   errors.password = "סיסמא חייבת להכיל ספרה";
            // }

            // return errors;
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
              handleSubmit, setFieldValue, dirty, isValid
            } = props;

            return (
              <form id="myForm" onSubmit={handleSubmit}>
                <Dialog dir="rtl" scroll="paper" open={teacher ? true : false} onClose={handleClose}>
                  <DialogTitle > <Typography variant="h6" align="center">עדכון פרטי מורה</Typography></DialogTitle>
                  <DialogContent>
                    <DialogContentText>

                    </DialogContentText>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                      {/* <div> */}
                      <TextField
                        label="שם פרטי"
                        name="firstName"
                        id="outlined-start-adornment"
                        sx={{ m: 1, width: '25ch' }}
                        // InputProps={{
                        //   startAdornment: <InputAdornment position="start">kg</InputAdornment>,
                        // }}

                        error={(errors.firstName && touched.firstName)}
                        helperText={touched.firstName && errors.firstName ? errors.firstName : " "}

                        value={values.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}

                      /> <TextField
                        label="שם משפחה"
                        name="lastName"
                        id="outlined-start-adornment"
                        sx={{ m: 1, width: '25ch' }}
                        // InputProps={{
                        //   startAdornment: <InputAdornment position="start">kg</InputAdornment>,
                        // }}
                        onBlur={handleBlur}
                        value={values.lastName}
                        onChange={handleChange}
                        error={(errors.lastName && touched.lastName)}

                        helperText={touched.lastName && errors.lastName ? errors.lastName : " "}


                      /> <TextField
                        label="תעודת זהות"
                        name="tz"
                        onBlur={handleBlur}
                        id="outlined-start-adornment"
                        sx={{ m: 1, width: '25ch' }}
                        // InputProps={{
                        //   startAdornment: <InputAdornment position="start">kg</InputAdornment>,
                        // }}
                        value={values.tz}
                        onChange={handleChange}
                        error={(errors.tz && touched.tz)}
                        helperText={touched.tz && errors.tz ? errors.tz : " "}


                      />
                      {/* <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <OutlinedInput
                          id="outlined-adornment-weight"
                          value={values.tz}
                          onChange={handleChange}
                          endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                          aria-describedby="outlined-weight-helper-text"
                          inputProps={{
                            'aria-label': 'weight',
                          }}
                        />
                        <FormHelperText id="outlined-weight-helper-text">Weight</FormHelperText>
                      </FormControl> */}


                      <TextField
                        label="טלפון"
                        name="phone"
                        onBlur={handleBlur}
                        id="outlined-start-adornment"
                        sx={{ m: 1, width: '25ch' }}

                        value={values.phone}
                        onChange={handleChange}
                        error={(touched.phone && errors.phone) ? true : false}
                        helperText={touched.phone && errors.phone ? errors.phone : " "}


                      /> <TextField
                        label="מייל"
                        name="email"
                        onBlur={handleBlur}
                        id="outlined-start-adornment"
                        sx={{ m: 1, width: '25ch' }}

                        value={values.email}
                        onChange={handleChange}
                        error={(touched.email && errors.email) ? true : false}
                        helperText={touched.email && errors.email ? errors.email : " "}


                      />
                      <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">סיסמא</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-password"
                          name="password"

                          type={showPassword ? 'text' : 'password'}
                          value={values.password}
                          onChange={handleChange}
                          error={(touched.password && errors.password) ? true : false}
                          helperText={touched.password && errors.password ? errors.password : " "}
                          onBlur={handleBlur}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          }
                          label="Password"
                        />
                      </FormControl>
                      <FormControl sx={{ m: 1, width: "20ch" }}>
                        <InputLabel htmlFor="outlined-adornment-amount">כתובת</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-amount"
                          name="address"
                          error={(errors.address && touched.address)}
                          helperText={touched.address && errors.address ? errors.address : " "}
                          onBlur={handleBlur}
                          value={values.address}
                          onChange={handleChange}
                          // startAdornment={<InputAdornment position="start">$</InputAdornment>}
                          label="כתובת"
                        />


                      </FormControl> <TextField
                        id="tz"
                        name="workerNum"
                        type="text"
                        label="מספר עובד"
                        value={values.workerNum}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={{ m: 1, width: '20ch' }}
                        error={(errors.workerNum && touched.workerNum)}
                        helperText={touched.workerNum && errors.workerNum ? errors.workerNum : " "}

                        className={errors.workerNum && touched.workerNum && "error"}
                      />
                      <FormControl sx={{ m: 1 }}>    <TextField
                        id="outlined-select-currency"
                        select
                        label="תפקיד"
                        name="role"

                        value={values.role}
                        onChange={handleChange}
                        error={touched.role && errors.role}
                        helperText={touched.role && errors.role ? errors.role : undefined}

                      // helperText="Please select your currency"
                      >
                        {roles.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                      </FormControl>

                    </Box>

                    {/*  <DisplayFormikState {...props} />*/}

                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} >בטל</Button>

                    <Button type="submit" form="myForm" disabled={isSubmitting}  >שמור</Button>
                  </DialogActions>
                </Dialog>
              </form>
            );

          }}
        </Formik>)}

    </div>
  );
}