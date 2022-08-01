import React, { useState, useEffect } from "react";
// import "./ExportToExcel.css";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import axios from "axios";

import { BASE_URL } from "../VARIABLES";
import { getCurrentViewMonthAndYear } from "../Utils";
import { useSelector } from "react-redux";

import { Autocomplete, Paper,TextField, MenuItem, Select, FormControl, InputLabel, Button, CircularProgress, Box } from "@mui/material";

const ExportToExcelManager = () => {
    const reduxTeachers = useSelector(st => st.teachers);
    const reduxCourses = useSelector(st => st.courses);
    const [courses, setCourses] = useState(reduxCourses);
    const [teachers, setTeachers] = useState(reduxTeachers);
    const [directorId, setDirectorId] = useState(null);
    const [teacherLoading, setTeacherLoading] = useState(false);
    const [courseLoading, setCourseLoading] = useState(false);
    useEffect(() => {
        if (!reduxTeachers || !reduxTeachers.length) {
            setTeacherLoading(true)
            axios.get(BASE_URL + "users/teachers").
                then(res => {
                    console.log(res.data);
                    let t = res.data;
                    setTeachers(res.data)

                }).
                catch(err => {
                    console.log(err);
                    alert("תקלה בהצגת המורות")
                }).finally(() => { setTeacherLoading(false) })

        }

    }, [reduxTeachers]);

    useEffect(() => {
        if (!reduxCourses || !reduxCourses.length) {
            setCourseLoading(true);
            axios.get(BASE_URL + "courses").
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


    }, [reduxCourses]);

    let [year, setYear] = useState(getCurrentViewMonthAndYear().year);


    let [month, setMonth] = useState(getCurrentViewMonthAndYear().month);
    let [teacher, setTeacher] = useState(null);
    let [course, setCourse] = useState(null);
    let currentUser = useSelector(st => st.currentUser);



    const getData = () => {


        if (currentUser) {

            let courseId = course?._id;
            let teacherId = teacher?._id;
            axios.get(`${BASE_URL}reports/searchByParameters/${year}/${month}/${directorId}/${courseId}/${teacherId}`).then(res => {

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
            <Paper sx={{ width: "60ch", margin: "auto", mt: 7, padding: "20px" }}>
                <Box sx={{ display: "flex", 'flex-wrap': 'wrap', "flex-direction": "row", "justify-content": "center", "align-items": "center" }}>




                    <FormControl sx={{ m: 1, width: "25ch" }}>
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

                    <FormControl sx={{ m: 1, width: "25ch" }}>
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
                        disablePortal

                        options={teachers}
                        sx={{ m: 1, width: "25ch" }}
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
                        options={courses}
                        sx={{ m: 1, width: "25ch" }}
                        getOptionLabel={(item) => item.name + " " + item.description}
                        value={course}
                        onChange={(event, newValue) => {
                            console.log(newValue)
                            setCourse(newValue);
                        }}


                        renderInput={(params) => courseLoading ? <CircularProgress /> : <TextField {...params} label="קורס" />}
                    />

                    <Button type="button" variant="contained" sx={{ m: 1, width: "25ch" }} onClick={getData}>
                        הורדה לקובץ Excel
                    </Button>
                </Box>
            </Paper>
        </form>
    </div>;
}
export default ExportToExcelManager;