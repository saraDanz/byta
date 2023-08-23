// import "./AddTeacher.css";
import React, { useState } from "react";
import { Paper, Button, MenuItem, Typography, InputLabel, FormControl, Box, TextField, Select } from "@mui/material";
import { Formik } from "formik";
// import * as EmailValidator from "email-validator";
// import * as Yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import { BASE_URL } from "../VARIABLES";
import * as Yup from "yup";

const variableSchema = Yup.object().shape({
    name: Yup.string()
        .required('שדה חובה'),
    key: Yup.string()
        .required('שדה חובה'),

    value: Yup.string()
        .required("שדה חובה"),


    dataType: Yup.string(),

});
export default function AddEditVariableDialog({ handleClose, status, variable, onSave, onEdit }) {


    return <div className="add-user">
        <Formik
            validationSchema={variableSchema}

            initialValues={status == 1 ? { key: "", name: "", value: "", dataType: "String" } :
                { key: variable.key, name: variable.name, value: variable.value, dataType: variable.dataType }}
            onSubmit={(values, { setSubmitting }) => {

                axios.post(BASE_URL + "variables", values).then(res => {
                    console.log(res)
                    console.log("variable added in", values);
                    setSubmitting(false);
                    alert("נתון נשמר בהצלחה")
                    onSave(res.data)
                  

                }).catch(err => {
                    console.log(err);
                    alert("התרחשה תקלה בשמירת הנתון");
                    setSubmitting(false);

                }).finally(() => {
                   
                })


                if (status == 2) {
                    onEdit();

                }
                handleClose();
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
                    handleSubmit,
                    setFieldValue, isValid, dirty
                } = props;

                return (
                    <form onSubmit={handleSubmit} id="myForm">
                        <Dialog dir="rtl" scroll="paper" open={true} onClose={handleClose}>
                            <DialogTitle > <Typography variant="h6" align="center"> פרטי נתון מערכת</Typography></DialogTitle>
                            <DialogContent>
                                <DialogContentText>

                                </DialogContentText>

                                <Box sx={{ display: "flex", 'flexWrap': 'wrap', "justifyContent": "center", "alignItems": "center" }}>

                                    <TextField
                                        id="name"
                                        name="name"
                                        type="text"
                                        label="משמעות השדה"
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        sx={{ m: 1, width: '25ch' }}
                                        error={(errors.name && touched.name)}
                                        helperText={touched.name && errors.name ? errors.name : " "}

                                        className={errors.name && touched.name && "error"}
                                    />
                                    <TextField
                                        id="key"
                                        name="key"
                                        type="text"
                                        label="שם הנתון"
                                        value={values.key}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        sx={{ m: 1, width: '25ch' }}
                                        error={(errors.key && touched.key)}
                                        helperText={touched.key && errors.key ? errors.key : " "}

                                        className={errors.key && touched.key && "error"}
                                    />



                                    <TextField
                                        sx={{ m: 1, width: '25ch' }}
                                        id="value"
                                        name="value"
                                        type="text"
                                        label="ערך"
                                        value={values.value}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={(errors.value && touched.value)}
                                        helperText={touched.value && errors.value ? errors.value : " "}
                                        className={errors.value && touched.value && "error"}
                                    />


                                    <FormControl sx={{ m: 1, width: '25ch' }}>
                                        <InputLabel id="demo-simple-select-autowidth-label">סוג הנתון</InputLabel>

                                        <Select
                                            id="rolrr"
                                            value={values.valueType}


                                            onChange={(eve) => { setFieldValue("valueType", eve.target.value) }}>


                                            <MenuItem value="String">
                                                <em>טקסט</em>
                                            </MenuItem>
                                            <MenuItem value="Date">
                                                <em>תאריך</em>
                                            </MenuItem>
                                            <MenuItem value="Number">
                                                <em>מספר</em>
                                            </MenuItem>
                                            <MenuItem value="Array">
                                                <em>מערך</em>
                                            </MenuItem>
                                            <MenuItem value="Boolean">
                                                <em>כן/לא</em>
                                            </MenuItem>
                                        </Select>
                                    </FormControl>






                                </Box>



                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} >בטל</Button>

                                <Button type="submit" form="myForm" disabled={isSubmitting}  >שמור</Button>
                            </DialogActions>
                        </Dialog>

                    </form>
                );

            }}
        </Formik>
        );
    </div >
}