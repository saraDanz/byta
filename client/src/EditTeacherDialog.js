import { useState } from 'react';
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
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { BASE_URL } from "./VARIABLES";
import { Formik } from "formik";
import axios from "axios";

export default function EditTeacherDialog({ teacher, handleClose, saveChanges }) {
  const [showPassword, setShowPassword] = useState(false);

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
      <Button variant="outlined" >
        Open form dialog
      </Button>
      {teacher && (
        <Formik
          initialValues={{ tz: teacher.tz, firstName: teacher.firstName, lastName: teacher.lastName, email: teacher.email, address: teacher.address, phone: teacher.phone, password: teacher.password, role: teacher.role }}
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
                        value={values.firstName}
                        onChange={handleChange}

                      /> <TextField
                        label="שם משפחה"
                        name="lastName"
                        id="outlined-start-adornment"
                        sx={{ m: 1, width: '25ch' }}
                        // InputProps={{
                        //   startAdornment: <InputAdornment position="start">kg</InputAdornment>,
                        // }}
                        value={values.lastName}
                        onChange={handleChange}

                      /> <TextField
                        label="תעודת זהות"
                        name="tz"

                        id="outlined-start-adornment"
                        sx={{ m: 1, width: '25ch' }}
                        // InputProps={{
                        //   startAdornment: <InputAdornment position="start">kg</InputAdornment>,
                        // }}
                        value={values.tz}
                        onChange={handleChange}

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
                      <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">סיסמא</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-password"
                          name="password"

                          type={showPassword ? 'text' : 'password'}
                          value={values.password}
                          onChange={handleChange}
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

                      <TextField
                        label="טלפון"
                        name="phone"

                        id="outlined-start-adornment"
                        sx={{ m: 1, width: '25ch' }}
                        // InputProps={{
                        //   startAdornment: <InputAdornment position="start">kg</InputAdornment>,
                        // }}
                        value={values.phone}
                        onChange={handleChange}

                      /> <TextField
                        label="מייל"
                        name="email"
                        id="outlined-start-adornment"
                        sx={{ m: 1, width: '25ch' }}
                        // InputProps={{
                        //   startAdornment: <InputAdornment position="start">kg</InputAdornment>,
                        // }}
                        value={values.email}
                        onChange={handleChange}

                      />

                      <FormControl sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-amount">כתובת</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-amount"
                          name="address"

                          value={values.address}
                          onChange={handleChange}
                          // startAdornment={<InputAdornment position="start">$</InputAdornment>}
                          label="כתובת"
                        />
                      </FormControl>
                      <FormControl sx={{ m: 1 }}>    <TextField
                        id="outlined-select-currency"
                        select
                        label="תפקיד"
                        name="role"

                        value={values.role}
                        onChange={handleChange}
                      // helperText="Please select your currency"
                      >
                        {roles.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                      </FormControl>
                      {/* </div> */}
                    </Box>
                    {/* <label htmlFor="tz">מספר זהות</label>
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
                  </button> */}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} >בטל</Button>
                    <Button type="submit" form="myForm"  >שמור</Button>
                  </DialogActions>
                </Dialog>
              </form>
            );

          }}
        </Formik>)}

    </div>
  );
}