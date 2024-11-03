import { useState, useTransition, useMemo, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from "react-redux"
import { InputAdornment, TextField, ListItemButton } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Box from '@mui/material/Box';
import List from '@mui/material/List';

import "./TeacherListQuick.css";
import Typography from '@mui/material/Typography';

import LinearProgress from '@mui/material/LinearProgress';
// import Box from '@mui/material/Box';
// import DeleteIcon from '@mui/icons-material/Delete';

import { BASE_URL } from './VARIABLES';
import axios from 'axios';
import TeacherListItem from './TeacherListItem';
import EditTeacherDialog from "./EditTeacherDialog";

import ExportMenu from './Menu/ExportMenu';
import { exportToCSV } from "./ExportToExcel/exportToExcelUtils";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

import { Link, Outlet, useNavigate } from "react-router-dom";
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';



import Pagination from '@mui/material/Pagination';
import TeacherListItemQuick from './TeacherListItemQuick';

const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

export default function TeacherListQuickMain({teachersUrl,teacherTotalPagesUrl}) {
    const deleteTeacher = (item) => {
        let confir = window.confirm("האם ברצונך למחוק מורה " + item.firstName + " " + item.lastName)
        let id = item._id
        if (confir)
            axios.delete(BASE_URL + "users/" + id).then(res => {
                console.log(res.data);
                setTeachers(teachers.filter(item => item._id !== id));
            }).
                catch(err => {
                    console.log(err);
                    alert("תקלה במחיקת מורה")
                })
    }
    const [teachers, setTeachers] = useState([]);
    // const [searchTerm, setSearchTerm] = useState("");
    const searchField = useRef()
    const [isLoading, setIsLoading] = useState(false);
    let navigate = useNavigate();

    const [editTeacherDialogVisible, setEditTeacherDialogVisible] = useState(null)
    // const [isPending, startTransition] = useTransition();
    const defaultFare = useSelector(st => st.variable.defaultFare);
    const [currentPage, setCurrentPage] = useState(-1);
    const [totalPages, setTotalPages] = useState(10);

    const saveUpdateChanges = (updated) => {
        setTeachers(teachers.map(teacher => {
            if (teacher._id != updated._id)
                return teacher;
            return { ...updated, courses: teacher.courses };
        }).sort(
            function (a, b) {
                if (a.lastName === b.lastName) {

                    return a.firstName > b.firstName ? 1 : -1;
                }
                return a.lastName > b.lastName ? 1 : -1;
            }));

    }
    const updateTeacherCourseStatus = (teacherId, courseId, status) => {
        let z = teachers.map(item => {
            if (item._id == teacherId)
                return { ...item, courses: item.courses.map(x => x._id !== courseId ? x : { ...x, isActive: status }) }
            return item;
        })
        setTeachers(z)
    }
    const deleteTeacherFromCourse = (teacherId, courseId) => {
        let res = teachers.map(item => {
            if (item._id == teacherId)
                return { ...item, courses: item.courses.filter(x => x._id !== courseId) }
            return item;
        })
        setTeachers(res)
    }
    const updateFare = (courseId, teacherId) => {
        let newFare = prompt("מהו תעריף הנסיעות החדש?", defaultFare.value);
        if (!newFare)
            return;
        axios.put(`${BASE_URL}teacherCourses/updateFare/${courseId._id}/${teacherId._id}`, { fare: newFare }).
            then(res => {


                let z = teachers.map(item => {
                    if (item._id == teacherId._id)
                        return { ...item, courses: item.courses.map(x => x._id !== courseId._id ? x : { ...x, fares: [...x.fares, res.data] }) }
                    return item;
                })
                setTeachers(z)
                alert("עדכון תעריף  בוצע בהצלחה")

            }).

            catch(err => {
                console.log(err);
                alert("תקלה בעדכון תעריף הנסיעות")
            }).finally(() => { setIsLoading(false) })

    }

    const getTotalPages = () => {
        setCurrentPage(-1)
        axios.get(BASE_URL + teacherTotalPagesUrl+"?s=" + (searchField.current.value || "")).then(res => {
            setTotalPages(res.data.totalPages)
            setCurrentPage(1)

        }).catch(err => {
            console.log(err);
            alert("תקלה בשליפת מספר עמודים")
        })
    }
    useEffect(() => {
        getTotalPages()
    }, [])
    useEffect(() => {
        setIsLoading(true)
        if (currentPage == -1)
            return;
        axios.get(BASE_URL + teachersUrl+"?page=" + currentPage + "&s=" + (searchField.current.value || "")).
            then(res => {
                console.log(res.data);
                let t = res.data;
                setTeachers(t)
                console.log(t)
            }).

            catch(err => {
                console.log(err);
                alert("תקלה בהצגת המורות")
            }).finally(() => { setIsLoading(false) })



    }, [currentPage, totalPages]);


    let t = useMemo(() => {
        return teachers.map(item => {
            let { firstName, lastName, tz, address, email, password, phone, workerNum } = item;
            return { firstName, lastName, tz, address, email, password, phone, workerNum };
        })
    }, [teachers])
    let tWithCourses = useMemo(() => {
        let arr = [];
        teachers.forEach(item => {
            let { courses, status, workerNum, role, _id, ...teacherCopy } = item;
            item.courses.forEach(c => {
                let { directorId, fares, _id, status, ...o } = c;
                arr.push({ ...teacherCopy, workerNum, ...o, fares: fares && fares.length ? fares[fares.length - 1].rate : "-" });
            })

        });
        return arr;
    }, [teachers])
    return (<div >

        <ExportMenu disabled={teachers.length == 0} items={[
            {
                text: "excelמורות בדף זה ל",
                onClick: () => {
                    // let t = teachers.map(item => {
                    //     let { firstName, lastName, tz, address, email, password, phone, workerNum } = item;
                    //     return { firstName, lastName, tz, address, email, password, phone, workerNum };
                    // })

                    exportToCSV(t, 'פרטי מרצות' + new Date().toLocaleDateString(),
                        [["שם פרטי", "שם משפחה", "תז", "כתובת", "מייל", "סיסמא", "טלפון", "מספר עובד"]],
                        [
                            { wch: 12 },
                            { wch: 12 },
                            { wch: 12 },
                            { wch: 15 },
                            { wch: 15 },
                            { wch: 12 },
                            { wch: 12 },
                            { wch: 12 },
                            { wch: 12 },
                            { wch: 12 },
                            { wch: 12 },
                            { wch: 12 },

                        ])
                }, icon: <FileDownloadOutlinedIcon />
            }
            , {
                text: "excelמורות הומצגות כאן וקורסים ל",
                onClick: () => {


                    exportToCSV(tWithCourses, 'פרטי מורות וקורסים' + new Date().toLocaleDateString(), [
                        ["שם פרטי", "שם משפחה", "תז", "כתובת", "מייל", "סיסמא", "טלפון", "מספר עובד", "משך שיעור", "תאור", "שם", "תאריך התחלת הקורס", "תעריף נסיעות", "סמל קורס"]],
                        [
                            { wch: 15 },
                            { wch: 15 }

                        ])
                },
                icon: <FileDownloadOutlinedIcon />

            }, { type: "divider" },
            {
                text: "PDFמורות מדף זה ל",
                onClick: () => {
                    navigate("/printInformation", { state: { data: t, title: "פרטי מורות", fields: ["firstName", "lastName", "tz", "workerNum", "address", "phone", "email", "password"], headers: ["שם פרטי", "שם משפחה", "תז", "מספר עובד", "כתובת", "טלפון", "מייל", "סיסמא"] } })

                },
                icon: <PictureAsPdfOutlinedIcon />

            }, {
                text: "PDFמורות מדף זה וקורסים ל",
                onClick: () => {
                    navigate("/printInformation", { state: { data: tWithCourses, title: "פרטי מורות וקורסים", fields: ["firstName", "lastName", "tz", "workerNum", "email", "name", 'description', "symbol", "fares",], headers: ["שם פרטי", "שם משפחה", "תז", "מספר עובד", "מייל", "שם", "תאור", "סמל קורס", "תעריף נסיעות"] } })

                },
                icon: <PictureAsPdfOutlinedIcon />

            }
        ]} />

        <Outlet />

        <Box sx={{ flexGrow: 1 }}>
            {/*     <TextField
                sx={{ float: "left", m: 1 }}
                id="input-with-icon-textfield"
                label=""
                onChange={(e) => {
                    startTransition(() => {
                        setSearchTerm(e.target.value)
                    })

                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                variant="outlined"
            />
            */}
            <TextField
                variant="outlined"
                placeholder="חיפוש..."

                inputRef={searchField}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">

                            <IconButton onClick={(e) => { searchField.current.value = ""; getTotalPages() }} edge="end">
                                <ClearIcon />
                            </IconButton>
                            <IconButton onClick={() => { getTotalPages() }} edge="end">
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}

            />

            <Typography sx={{ mt: 4, mb: 2 }} variant="h5" component="div">
                מורות
            </Typography>
            {isLoading && <Box sx={{ display: "block", width: '100%' }}><LinearProgress /></Box>}
            {!isLoading && teachers.length > 0 && <Box sx={{ width: "100%", display: "flex", "alignItems": "center", justifyContent: "center" }}  >
                <Pagination page={currentPage} shape="rounded" onChange={(e, pag) => { setCurrentPage(pag) }} count={totalPages} variant="outlined" color="primary" />
            </Box>
            }
            <Demo>
                {!isLoading && teachers.length == 0 && <Typography sx={{ textAlign: "center" }} variant="h6">
                    אין תוצאות מתאימות לחיפוש
                </Typography>}
                <List dense={false} dir="ltr">
                    {teachers.map(item => {
                        return <TeacherListItemQuick withReports={false} editFare={updateFare}  updateStatus={updateTeacherCourseStatus} deleteTeacherFromCourse={deleteTeacherFromCourse} key={item._id} editTeacher={() => { setEditTeacherDialogVisible(item) }} deleteTeacher={deleteTeacher} item={item} />
                    })}
                </List>
            </Demo>

        </Box>
        {
            !isLoading && teachers.length > 0 && <Box sx={{ width: "100%", display: "flex", "alignItems": "center", justifyContent: "center" }}  >
                <Pagination page={currentPage} shape="rounded" onChange={(e, pag) => { setCurrentPage(pag) }} count={totalPages} variant="outlined" color="primary" />
            </Box>
        }

        <EditTeacherDialog teacher={editTeacherDialogVisible} saveChanges={saveUpdateChanges} handleClose={() => { setEditTeacherDialogVisible(null) }} />
    </div >

    );
}