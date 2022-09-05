import React, {
    useState, useEffect
} from "react";
// import "./ExportToExcel.css";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import axios from "axios";
import { Header, Icon, Modal } from 'semantic-ui-react'
import { Autocomplete, TextField, MenuItem, Select, FormControl, InputLabel, Button, CircularProgress, Box, Paper } from "@mui/material";

import { BASE_URL } from "../VARIABLES";
import { getCurrentViewMonthAndYear } from "../Utils";
import { useSelector } from "react-redux";

export default function ExportToExcel() {

    //    axios.get(`${BASE_URL}reports/byDirectorIdYearAndMonth/${currentUser._id}/${year}/${month}`).then(res => {

    const reduxTeachers = useSelector(st => st.index.teachers);
    const reduxCourses = useSelector(st => st.index.courses);
    const [courses, setCourses] = useState(reduxCourses);
    const [teachers, setTeachers] = useState(reduxTeachers);

    const [teacherLoading, setTeacherLoading] = useState(false);
    const [courseLoading, setCourseLoading] = useState(false);
    let [year, setYear] = useState(getCurrentViewMonthAndYear().year);


    const [month, setMonth] = useState(getCurrentViewMonthAndYear().month);
    const [teacher, setTeacher] = useState(null);
    const [course, setCourse] = useState(null);
    let currentUser = useSelector(st => st.index.currentUser);
    useEffect(() => {
        if (currentUser) {
            setTeacherLoading(true);
            setCourseLoading(true);
            axios.get(BASE_URL + "users/byDirectorId/" + currentUser._id).
                then(res => {
                    console.log(res.data);
                    let t = res.data;
                    setTeachers(res.data)

                }).
                catch(err => {
                    console.log(err);
                    alert("תקלה בהצגת המורות")
                }).finally(() => { setTeacherLoading(false) })


            axios.get(BASE_URL + "courses/byDirectorId/" + currentUser._id).
                then(res => {
                    console.log(res.data);
                    let t = res.data;
                    setCourses(res.data)

                }).
                catch(err => {
                    console.log(err);
                    alert("תקלה בהצגת הקורסים")
                }).finally(() => { setCourseLoading(false) })

        }

    }, [currentUser]);







    const getData = () => {


        if (currentUser) {

            let courseId = course?._id;
            let teacherId = teacher?._id;
            axios.get(`${BASE_URL}reports/searchByParameters/${year}/${month}/null/${courseId}/${teacherId}`).then(res => {

                // axios.get(`${BASE_URL}reports/byYearAndMonth/${year}/${month}`).then(res => {
                console.log(res);
                try {
                    let reports = res.data.map(item => {
                        let { courseId, teacherId, fromTime, toTime, date, reportDate, ...x } = item;
                        fromTime = new Date(fromTime);
                        toTime = new Date(toTime);
                        date = new Date(date)
                        return {
                            ...x, teacherFirstName: teacherId.firstName,
                            teacherlastName: teacherId.lastName,
                            courseName: courseId.name,
                            directorFirstName: courseId.directorId.firstName,
                            directorLastName: courseId.directorId.lastName,
                            fromTime: fromTime && (fromTime.getHours() + ":" + fromTime.getMinutes()) || "00:00",
                            toTime: toTime && (toTime.getHours() + ":" + toTime.getMinutes()) || "00:00",
                            date: date.toLocaleDateString()
                        }
                    });
                    exportToCSV(reports, `report-${year}-${month}`)
                }
                catch (er) {
                    console.log(er)
                    alert("שגיאה בשמירת הקובץ")
                }

            }).catch(err => {
                console.log(err);
                alert("שגיאה בקבלת הדווחים לחודש זה")
            })
        }
    }


    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }
    let da = new Date().getFullYear();
    return <div className="excel">
        <form>
            <Paper sx={{width:"60ch",margin:"auto",mt:7,padding:"20px"}}>
            <Box sx={{display:"flex",'flexWrap':'wrap',"justifyContent":"center","alignItems":"center"}}>


                <FormControl   sx={{ m: 1, width: '25ch' }}>
                    <InputLabel id="demo-simple-select-autowidth-label">שנה</InputLabel>
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={year}
                        onChange={(e) => { setYear(e.target.value) }}
                        autoWidth
                        label="Age"
                    >
                        {/* <MenuItem value="">
                                <em>בחר שנה</em>
                            </MenuItem> */}
                        {[...Array(20)].map((item, index) => { return <MenuItem key={index} value={index + da - 19}>{index + da - 19}</MenuItem> })}

                    </Select>
                </FormControl>

                <FormControl    sx={{ m: 1, width: '25ch' }}>
                    <InputLabel id="demo-simple-select-autowidth-label">חודש</InputLabel>
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={month}
                        onChange={(e) => { setMonth(e.target.value) }}
                        autoWidth
                        label="Age"
                    >
                        {/* <MenuItem value="">
                                <em>בחר חודש</em>
                            </MenuItem> */}
                        {[...Array(12)].map((item, index) => { return <MenuItem key={index} value={index + 1}>{index + 1}</MenuItem> })}

                    </Select>
                </FormControl>




                <Autocomplete
                  sx={{ m: 1, width: '25ch' }}
                    disablePortal
                    disabled={course ? true : false}
                    options={teachers}
                    
                    getOptionLabel={(item) => item.firstName + " " + item.lastName}
                    value={teacher}
                    onChange={(event, newValue) => {
                        setTeacher(newValue);
                        console.log(newValue)

                    }}


                    renderInput={(params) => teacherLoading ? <CircularProgress /> : <TextField {...params} label="מורה" />}
                />
                <Autocomplete
                    disablePortal
                    disabled={teacher ? true : false}
                    sx={{ m: 1, width: '25ch' }}
                    options={courses}
                 
                    getOptionLabel={(item) => item.name + " " + item.description}
                    value={course}
                    onChange={(event, newValue) => {
                        console.log(newValue)
                        setCourse(newValue);
                    }}


                    renderInput={(params) => courseLoading ? <CircularProgress /> : <TextField {...params} label="קורס" />}
                />

                <Button type="button" variant="outlined"   sx={{ m: 1, width: '25ch' }} onClick={getData}>
                    הורדה לקובץ Excel
                </Button>
            </Box>
            </Paper>
        </form>
    </div>;
}