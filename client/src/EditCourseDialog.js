import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import "./EditCourseDialog.css"
import {
  IconButton, InputAdornment, OutlinedInput, FormControl, InputLabel,
  Box, MenuItem, Typography, Autocomplete
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { BASE_URL } from "./VARIABLES";
import { Formik } from "formik";
import axios from "axios";
// import EditCourseDialog from "./EditTeacherDialog";

export default function EditCourseDialog({ course, handleClose, saveChanges }) {
  const [directors, setDirectors] = useState([]);

  useEffect(() => {
    axios.get(BASE_URL + "users/directors").
      then(res => {
        console.log(res.data);
        setDirectors(res.data);
      }).
      catch(err => {
        console.log(err);
        alert("תקלה בהצגת הרכזות")
      })
  }, []);
  return (
    <div>

      {course && (
        <Formik initialValues={{ name: course.name, description: course.description, directorId: course.directorId, symbol: course.symbol }}
          onSubmit={(values, { setSubmitting }) => {

            if (!values.directorId && directors)
              values.directorId = directors[0]._id;
              if(values.directorId._id)
              values.directorId=values.directorId._id;//במקרה ולא שינו את הרכזת
              //בגלל שהערך ברירת מחדל של האוטוקומפליט צריך להיות אובייקט אבל צריך לשמור רק את קוד הרכזת
            axios.put(BASE_URL + "courses/" + course._id, values).then(res => {
              console.log(res)
              console.log("course updated in", values);

              setSubmitting(false);
              saveChanges(res.data)
              alert("קורס עודכן בהצלחה");

            }).catch(err => {
              console.log(err);

              alert("התרחשה תקלה בעדכון הקורס\n" + err);

              setSubmitting(false);
            }).finally(() => { handleClose() })

          }}

        // onSubmit={(values, { setSubmitting }) => {
        //   console.log(values);
        //   axios.put(BASE_URL + "users/" + teacher._id, values).then(res => {
        //     console.log(res)
        //     console.log("user updated in", values);
        //     saveChanges(res.data)
        //     setSubmitting(false);

        //     alert("פרטים עודכנו בהצלחה")
        //   }).catch(err => {
        //     console.log(err);
        //     alert("התרחשה תקלה בעדכון פרטי מורה");
        //     setSubmitting(false);
        //   }).finally(() => { handleClose(); })

        // }}


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
                <Dialog dir="rtl" scroll="body" open={course ? true : false} onClose={handleClose}>
                  <DialogTitle > <Typography variant="h6" align="center">עדכון פרטי קורס</Typography></DialogTitle>
                  <DialogContent >
                    <DialogContentText>

                    </DialogContentText>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>

                      <TextField
                        label="שם"
                        name="name"
                        id="outlined-start-adornment"
                        sx={{ m: 1, width: '25ch' }}
                        // InputProps={{
                        //   startAdornment: <InputAdornment position="start">kg</InputAdornment>,
                        // }}
                        value={values.name}
                        onChange={handleChange}

                      /> <TextField
                        label="תאור"
                        name="description"
                        id="outlined-start-adornment"
                        sx={{ m: 1, width: '25ch' }}
                        // InputProps={{
                        //   startAdornment: <InputAdornment position="start">kg</InputAdornment>,
                        // }}
                        value={values.description}
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


                      <TextField
                        label="סמל קורס"
                        name="symbol"

                        id="outlined-start-adornment"
                        sx={{ m: 1, width: '25ch' }}
                        // InputProps={{
                        //   startAdornment: <InputAdornment position="start">kg</InputAdornment>,
                        // }}
                        value={values.symbol}
                        onChange={handleChange}

                      />


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
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={directors}
                        defaultValue={values.directorId}
                        sx={{ width: 300 }}
                        getOptionLabel={(option) => option.firstName + " " + option.lastName}
                        onChange={(event, newValue) => {
                          console.log(newValue)
                          if (newValue)
                            setFieldValue("directorId", newValue._id)
                          //  setValue(newValue);
                        }}

                        // onInputChange={(event, newInputValue) => {
                        //   console.log(newInputValue,"input value")

                        // setInputValue(newInputValue);
                        // }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Box>

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