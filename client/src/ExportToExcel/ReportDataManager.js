import React, { useState, useEffect, useRef, useMemo } from "react";
// import "./ExportToExcel.css";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import axios from "axios";
import "./ReportDataManager.css";
import PDFDocument from "./PdfDocument";
import PrintFormat from "./PrintFormat";
import { BASE_URL } from "../VARIABLES";
import { getCurrentViewMonthAndYear, countTravelingDays } from "../Utils";
import { useSelector, useDispatch } from "react-redux";
import ReactPDF from '@react-pdf/renderer';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useReactToPrint } from 'react-to-print';
import IconButton from '@mui/material/IconButton';
import SearchTypes from "./SearchTypes";
import {
    DataGrid, GridFooterContainer, GridFooter,
    GridRowsProp, GridColDef, GridToolbarContainer,
    GridToolbarDensitySelector, GridToolbarColumnsButton,
    GridToolbarExport,
    gridSortedRowIdsSelector, useGridApiContext
} from '@mui/x-data-grid';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
// import { useDemoData } from '@mui/x-data-grid-generator';
import LinearProgress from '@mui/material/LinearProgress';
// import {ExportIcon} from "@mui/material/Icon"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
    Stack,
    Autocomplete
    , Tooltip, Paper, TablePagination,
    TextField, MenuItem, Select, FormControl, InputLabel, Button, CircularProgress, Box
} from "@mui/material";
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';

import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from "@mui/material";
import { CustomPagination } from "./CustomPagination";
import { sort } from "../Utils";
import { PDFDownloadLink } from "@react-pdf/renderer"

// import {FiberManualRecordIcon}from "@mui/icons-material";
const getUnfilteredRows = ({ apiRef }) => gridSortedRowIdsSelector(apiRef);

const dayInMonthComparator = (v1, v2) => {

    v1 = v1.split(".");
    v1 = v1[1] + "." + v1[0] + "." + v1[2];
    v2 = v2.split(".");
    v2 = v2[1] + "." + v2[0] + "." + v2[2]
    return new Date(v1) - new Date(v2);
}

export function CustomFooterStatusComponent(props) {
    return (
        <Box sx={{ p: 1, display: 'flex' }}>
            <TablePagination />
            סה"כ  דווחים פרונטליים:{props.travelingDays}
        </Box>
    );
}
function CustomToolbar(props) {
    const apiRef = useGridApiContext();
    const handleExport = (options) => {
        debugger;
        console.log(options)
        // apiRef.current.exportDataAsPrint(options)
        // handlePrint()
    };
    return (
        <GridToolbarContainer>
            <TextField
                sx={{ float: "left", m: 1, width: "20ch" }}
                id="input-with-icon-textfield"
                label=""
                onChange={(e) => { props.setSearchTerm(e.target.value) }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                variant="filled"
            />


            <GridToolbarColumnsButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport />
        </GridToolbarContainer>
    );
}
let columns = [
    { field: "courseName", headerName: "קורס", flex: 4 },
    { field: "teacherName", headerName: "מורה", flex: 4 },
    {
        field: "date", headerName: "תאריך", flex: 2,
        sortComparator: dayInMonthComparator,
        type: "date",
        valueGetter: param => { return param.value ? param.value.toLocaleDateString() : null }
        //    ,valueFormatter:param=>{return param.value?param.value.toLocaleDateString():null}
    },

    { field: "fromTime", headerName: "משעה", flex: 2 },
    { field: "toTime", headerName: "עד שעה", flex: 2 },
    { field: "numHours", headerName: "מספר שעות", flex: 2 },
    { field: "type", headerName: "סוג שיעור", flex: 3 },
    //    {field:"subject",headerName:"נושא"},
    { field: "directorName", headerName: "רכזת", flex: 3 },
    // { field: "reportDate", headerName: "תאריך דווח", flex: 2
    // ,valueFormatter:param=>{return param.value?param.value.toLocaleDateString():null}},
    {
        field: "reportDate", headerName: "תאריך דווח", flex: 2,
        sortComparator: dayInMonthComparator,
        type: "date",
        valueGetter: param => { return param.value ? param.value.toLocaleDateString() : null }
        //    ,valueFormatter:param=>{return param.value?param.value.toLocaleDateString():null}
    },
    { field: "comment", headerName: "הערות", flex: 3 }

];

columns = columns.map(column => {
    return {
        ...column,
        renderCell: (params) => (
            <Tooltip title={params.value}>
                <span>{params.value}</span>
            </Tooltip>
        ),
    }
})
function useApiRef() {
    const apiRef = useRef(null);
    const _columns = useMemo(
        () =>
            columns.concat({
                field: "__HIDDEN__",
                width: 0,
                hide: true,
                renderCell: (params) => {
                    apiRef.current = params.api;
                    return null;
                }
            }),
        [columns]
    );

    return { apiRef, columns: _columns };
}

let CustomFooter = (props) => {
    return (
        <GridFooterContainer>
            סה"כ ימי נסיעות:{props.travelingDays}
            <GridFooter sx={{
                border: 'none', // To delete double border.
            }} />
        </GridFooterContainer>
    );
}

const ReportDataManager = () => {
    const { apiRef, columns } = useApiRef();
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    });
    // const handleClickButton = () => {

    //   };
    const handlePdf = () => { console.log(apiRef.current.getRowModels()); }
    // const handlePdf = () => { ReactPDF.render(<MyDocument />, `${__dirname}/example.pdf`); }

    const reduxDirectors = useSelector(st => st.index.directors);
    const reduxTeachers = useSelector(st => st.index.teachers);
    const reduxCourses = useSelector(st => st.index.courses);
    const [courses, setCourses] = useState(reduxCourses);
    const [teachers, setTeachers] = useState(reduxTeachers);
    const [directors, setDirectors] = useState(reduxDirectors);
    const [director, setDirector] = useState(null);
    const [teacherLoading, setTeacherLoading] = useState(false);
    const [directorsLoading, setDirectorsLoading] = useState(false);
    const [reportsLoading, setReportsLoading] = useState(false);
    const [courseLoading, setCourseLoading] = useState(false);
    const [originalReports, setOriginalReports] = useState([]);
    const [reports, setReports] = useState([]);
    const [travelingDays, setTravelingDays] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    // const [sortOrder, setSortOrder] = useState("asc");
    // const [sortBy, setSortBy] = useState("date");

    useEffect(() => {

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "visible";
        }
    }, [])
    useEffect(() => {
        setTravelingDays(countTravelingDays(reports))
    }, [reports])

    useEffect(() => {
        let tempFilteredArrReports = originalReports.filter(item => {
            if (item.courseName.indexOf(searchTerm) > -1 || item.teacherName.indexOf(searchTerm) > -1 || item.fromTime && item.fromTime.indexOf(searchTerm) > -1 || item.toTime && item.toTime.indexOf(searchTerm) > -1 || item.date && item.date.toLocaleDateString().indexOf(searchTerm) > -1 || item.comments && item.comment.indexOf(searchTerm) > -1 || item.reportDate && item.reportDate.toLocaleDateString().indexOf(searchTerm) > -1)
                return true;
            return false;
        });
        tempFilteredArrReports = sort(tempFilteredArrReports, "date", "asc");
        setReports(tempFilteredArrReports);
    }, [originalReports, searchTerm]);

    // useEffect(() => {
    //     let tempFilteredArrReports = sort(reports, sortBy, sortOrder);
    //     setReports(tempFilteredArrReports);
    // }, [sortBy, sortOrder])



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
        if (!reduxDirectors || !reduxDirectors.length) {
            setDirectorsLoading(true)
            axios.get(BASE_URL + "users/directors").
                then(res => {
                    console.log(res.data);
                    let t = res.data;
                    setDirectors(res.data)


                }).
                catch(err => {
                    console.log(err);
                    alert("תקלה בהצגת הרכזות")
                }).finally(() => { setDirectorsLoading(false) })

        }

    }, [reduxDirectors]);

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
    const [searchFrom, setSearchFrom] = useState(null);
    const [searchTo, setSearchTo] = useState(null);
    let [teacher, setTeacher] = useState(null);
    let [course, setCourse] = useState(null);
    let currentUser = useSelector(st => st.index.currentUser);


    const getData = (type) => {


        if (currentUser) {

            let courseIdparam = course ?._id;
            let teacherIdparam = teacher ?._id;
            let directorIdparam = director ?._id;
            setReportsLoading(true);
            let url = `${BASE_URL}reports/searchByParameters/${year}/${month}/${directorIdparam}/${courseIdparam}/${teacherIdparam}`;
            if (type == SearchTypes.Range)
                url += `/${searchFrom ?.$d}/${searchTo ?.$d}`;
            else url += `/${undefined}/${undefined}`;
            axios.get(url).then(res => {

                // axios.get(`${BASE_URL}reports/byYearAndMonth/${year}/${month}`).then(res => {
                console.log(res);

                let reports = res.data.map(item => {
                    let { courseId, teacherId, fromTime, type, toTime, date, reportDate, ...x } = item;
                    fromTime = new Date(fromTime);
                    toTime = new Date(toTime);
                    date = new Date(date)
                    return {
                        ...x,
                        teacherName: teacherId.firstName + " " + teacherId.lastName,
                        courseName: courseId.name,
                        directorName: courseId.directorId.firstName + " " + courseId.directorId.lastName,
                        fromTime: fromTime && (fromTime.getHours() + ":" + fromTime.getMinutes()) || "00:00",
                        toTime: toTime && (toTime.getHours() + ":" + toTime.getMinutes()) || "00:00",
                        date: date,
                        reportDate: new Date(reportDate),
                        type: type == "frontal" ? "פרונטלי" : type == "distance" ? "למידה מרחוק" : type == "absence" ? "היעדרות" : null

                    }
                });
                // exportToCSV(reports, `report-${year}-${month}`)
                setOriginalReports(reports);



            }).catch(err => {
                console.log(err);
                alert("שגיאה בקבלת הדווחים לחודש זה")
            }).finally(() => { setReportsLoading(false) })
        }
    }
    const exportToExcel = () => {
        if (reports.length) {
            let rep = reports.map(item => {
                let { courseName, teacherName, date, fromTime, toTime, numHours, type, directorName, reportDate, comment } = item; return {
                    courseName, teacherName, date: date? 25569.0 + ((date.getTime() - (date.getTimezoneOffset() * 60 * 1000)) / (1000 * 60 * 60 * 24)):date, fromTime, toTime, numHours, type, directorName, reportDate: reportDate ? reportDate.toLocaleDateString() : reportDate, comment
                }
            })
            //לסנן עמודות לא רלוונטיות ולשלוח כפרמטר שמות לעמודות
            exportToCSV(rep, `report-${year}-${month}`, [['קורס', 'מורה', 'תאריך', "משעה", "עד שעה", "מספר שעות", "סוג", "רכזת", "תאריך דוח", "הערות"]])
        }
    }


    const exportToCSV = (csvData, fileName, heading) => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = {
            Sheets: { 'data': ws }, SheetNames: ['data'], Workbook: {
                Views: [
                    { RTL: true }
                ]
            }
        };
        // let heading = [['FirstName', 'Last Name', 'Email']];
        XLSX.utils.sheet_add_aoa(ws, heading);
        XLSX.utils.sheet_add_json(ws, csvData, { origin: 'A2', skipHeader: true });

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }
    let da = new Date().getFullYear();
    let minimumColumnsDetails = useMemo(() => {
        return columns.map((item, index) => { return { field: item.field, headerName: item.headerName } })
    }, [columns])
    
    return <>

        <PrintFormat columns={minimumColumnsDetails}
            ref={componentRef} data={reports} />
        <div className="excel" sx={{ overflow: "hidden", maxHeight: "60vh" }}>

            <form>

                <Paper sx={{ width: "87%", margin: "auto", mt: 1, padding: "20px", height: "90vh" }}>
                    <Box sx={{ display: "flex", "flex-direction": "column" }}>
                        <Box sx={{ display: "flex", 'flexWrap': 'wrap', "justifyContent": "center", "alignItems": "center" }}>
                            <Stack direction="row" >
                                <FormControl sx={{ m: 1, width: "15ch" }}>
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

                                <FormControl sx={{ m: 1, width: "15ch" }}>
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

                                    options={teachers || []}
                                    sx={{ m: 1, width: "22ch" }}
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
                                    options={courses || []}
                                    sx={{ m: 1, width: "22ch" }}
                                    getOptionLabel={(item) => item.name + " " + item.description}
                                    value={course}
                                    onChange={(event, newValue) => {
                                        console.log(newValue)
                                        setCourse(newValue);
                                    }}


                                    renderInput={(params) => courseLoading ? <CircularProgress /> : <TextField {...params} label="קורס" />}
                                />
                                <Autocomplete
                                    disablePortal

                                    options={directors || []}
                                    sx={{ m: 1, width: "22ch" }}
                                    getOptionLabel={(item) => item.firstName + " " + item.lastName}
                                    value={director}
                                    onChange={(event, newValue) => {
                                        setDirector(newValue);
                                        console.log(newValue)

                                    }}


                                    renderInput={(params) => directorsLoading ? <CircularProgress /> : <TextField {...params} label="רכזת" />}
                                />

                                <Button type="button" variant="contained" endIcon={<SearchIcon />} sx={{ height: "53.13px", m: 1, width: '10ch' }} onClick={() => { getData(SearchTypes.YearMonth) }}>
                                    חפש
                    </Button>


                                <Button type="button" variant="outlined" onClick={exportToExcel} sx={{ m: 1, width: "15ch" }} >
                                    הורדה לקובץ Excel

        </Button>
                                <Button type="button" startIcon={<LocalPrintshopOutlinedIcon />} variant="outlined" onClick={handlePrint} sx={{ m: 1 }} >

                                </Button>
                            {/*    {!reportsLoading && <PDFDownloadLink document={<PDFDocument columns={["courseName",
                                    "teacherName", "fromTime",
                                    "toTime",
                                    "numHours",
                                    "type", "directorName", "comment"]}
                                    data={reports} />}
                                    fileName={searchFrom ?.$d && searchTo ?.$d ? `report-${searchFrom ?.$d}-${searchTo ?.$d}.pdf` : `report-${month}-${year}.pdf`}>
                                    {({ blob, url, loading, error }) => (loading ? <Button type="button" startIcon={<PictureAsPdfOutlinedIcon />} variant="outlined" disabled="true" sx={{ m: 1 }} >      </Button> :
                                        <Button type="button" startIcon={<PictureAsPdfOutlinedIcon />} variant="outlined" onClick={handlePdf} sx={{ m: 1 }} >

                                        </Button>)}
                                </PDFDownloadLink>}*/}


                            </Stack>
                            <Stack direction="row" >
                                <FormControl sx={{ m: 1, width: "20ch" }}>

                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            inputFormat="DD/MM/YYYY"
                                            label="מתאריך"
                                            maxDate={searchTo}
                                            value={searchFrom}
                                            onChange={(newValue) => {
                                                setSearchFrom(newValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                                <FormControl sx={{ m: 1, width: "20ch" }}>

                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            inputFormat="DD/MM/YYYY"
                                            minDate={searchFrom}
                                            label="עד תאריך"
                                            disabled={!searchFrom}
                                            value={searchTo}
                                            onChange={(newValue) => {
                                                setSearchTo(newValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                                <Button type="button" disabled={!searchFrom || !searchTo} variant="contained" endIcon={<SearchIcon />} sx={{ height: "53.13px", m: 1, width: '13ch' }} onClick={() => { getData(SearchTypes.Range) }}>
                                    חפש בין תאריכים
            </Button>
                            </Stack>

                        </Box>


                        <DataGrid
                            disableColumnMenu
                            initialState={{

                            }}
                            localeText={{
                                toolbarColumns: "עמודות",
                                toolbarFilters: "my filters",
                                toolbarDensity: "צפיפות תצוגה",
                                toolbarExport: "שמירה "
                            }}

                            disableColumnFilter
                            components={{
                                Footer: CustomFooter,
                                Toolbar: CustomToolbar,
                                LoadingOverlay: LinearProgress,


                            }}
                            componentsProps={{
                                footer: { travelingDays },
                                toolbar: { setSearchTerm }
                            }}
                            hideFooterSelectedRowCount

                            sx={{ mt: 0.5, flex: 1, minHeight: "70vh" }}
                            loading={reportsLoading}
                            getRowId={(row) => row._id}
                            autoPageSize
                            rows={reports}
                            columns={columns} />

                    </Box>



                </Paper>
            </form>
        </div>
    </>;
}
export default ReportDataManager;