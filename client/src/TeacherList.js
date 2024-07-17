import { useState, useTransition, useMemo, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from "react-redux"
import { InputAdornment, TextField, ListItemButton } from "@mui/material";

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import "./TeacherList.css";
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import LinearProgress from '@mui/material/LinearProgress';
// import Box from '@mui/material/Box';
// import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { BASE_URL } from './VARIABLES';
import axios from 'axios';
import TeacherListItem from './TeacherListItem';
import EditTeacherDialog from "./EditTeacherDialog";
import EditIcon from '@mui/icons-material/Edit';
import ExportMenu from './Menu/ExportMenu';
import { exportToCSV } from "./ExportToExcel/exportToExcelUtils";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import { Link, Outlet, useNavigate } from "react-router-dom";
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
// import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
import ExportDrawer from './Menu/ExportDrawer';
import { PictureAsPdf } from '@mui/icons-material';



const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

export default function TeacherList() {
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
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    let navigate = useNavigate();
    // const [isFirst, setIsFirst] = useState(true);
    // const [filteredTeacherList, setFilteredTeacherList] = useState([]);
    const [editTeacherDialogVisible, setEditTeacherDialogVisible] = useState(null)
    const [isPending, startTransition] = useTransition();
    const defaultFare = useSelector(st => st.variable.defaultFare);


    const saveUpdateChanges = (updated) => {
        setTeachers(teachers.map(teacher => {
            if (teacher._id != updated._id)
                return teacher;
            return updated;
        }).sort(
            function (a, b) {
                if (a.lastName === b.lastName) {
                    // Price is only important when cities are the same
                    return a.firstName > b.firstName ? 1 : -1;
                }
                return a.lastName > b.lastName ? 1 : -1;
            }));

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
    /*const bringAllCourses = (t) => {
        // if (!isFirst)
        //     return;
        axios.get(BASE_URL + "teacherCourses").
            then(resp => {

                console.log(resp.data);
                // let t = teachers;
                t = t.map(item => { return { ...item, courses: resp.data.filter(a => a.teacherId && a.teacherId._id == item._id).map(x => x.courseId) } });
                setTeachers(t)
                setIsLoading(false)
                console.log(t)
                // setIsFirst(false)
            }).
            catch(err => {
                console.log(err);
                alert("תקלה בהצגת קורסים בהם מלמדות המורות")
                // setTeachers(t);
                setIsLoading(false)
            })
    }
    useEffect(() => {
        setIsLoading(true)
        axios.get(BASE_URL + "users/teachers").
            then(res => {
                console.log(res.data);
                let t = res.data;


                bringAllCourses(t);
                //setTeachers(t);

            }).
            catch(err => {
                console.log(err);
                alert("תקלה בהצגת המורות")

            }).finally(() => { setIsLoading(false) })



    }, []);*/
    useEffect(() => {
        setIsLoading(true)
        axios.get(BASE_URL + "teacherCourses/withTheirCourses").
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



    }, []);

    let filteredTeacherList = useMemo(() => {
        return teachers.filter(item => {
            if ((item.firstName + " " + item.lastName).indexOf(searchTerm) > -1 || item.firstName.indexOf(searchTerm) > -1 || item.lastName.indexOf(searchTerm) > -1 || item.tz.indexOf(searchTerm) > -1 || item.email && item.email.indexOf(searchTerm) > -1)
                return true;
            return false;
        })
    }, [searchTerm, teachers]);
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

        {/*  <ExportDrawer mainListItems={<>
                <ListItem>
                    <ListItemButton onClick={() => {
                        exportToCSV(t, 'פרטי מרצות' + new Date().toLocaleDateString(),
                            [["שם פרטי", "שם משפחה", "תז", "כתובת", "מייל", "סיסמא", "טלפון", "מספר עובד"]],
                            [
                                { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }])
                    }}>
                        <ListItemIcon>
                            <DownloadForOfflineOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={"מורות ל excel"} />
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton onClick={() => {
                        exportToCSV(tWithCourses, 'פרטי מורות וקורסים' + new Date().toLocaleDateString(), [
                            ["שם פרטי", "שם משפחה", "תז", "כתובת", "מייל", "סיסמא", "טלפון", "מספר עובד", "משך שיעור", "תאור", "שם", "תאריך התחלת הקורס", "תעריף נסיעות", "סמל קורס"]],
                            [
                                { wch: 15 },
                                { wch: 15 }

                            ])
                    }}
                    >
                        <ListItemIcon>
                            <DownloadForOfflineOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={"מורות וקורסים ל excel"} />
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton onClick={() => {
                        navigate("/printInformation", { state: { data: t, title: "פרטי מורות", fields: ["firstName", "lastName", "tz", "workerNum", "address", "phone", "email", "password"], headers: ["שם פרטי", "שם משפחה", "תז", "מספר עובד", "כתובת", "טלפון", "מייל", "סיסמא"] } })
                    }}>
                         <ListItemIcon>
                            <PictureAsPdfOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={"פרטי מורות לPDF"} />
                       
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton>
                        <ListItemIcon>
                            <PictureAsPdfOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={"פרטי מורות לPDF"} />
                    </ListItemButton>
                </ListItem>

                </>} />*/}
        <ExportMenu disabled={teachers.length==0} items={[
            {
                text: "excelמורות ל",
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
                text: "excelמורות וקורסים ל",
                onClick: () => {


                    exportToCSV(tWithCourses, 'פרטי מורות וקורסים' + new Date().toLocaleDateString(), [
                        ["שם פרטי", "שם משפחה", "תז", "כתובת", "מייל", "סיסמא", "טלפון", "מספר עובד", "משך שיעור", "תאור", "שם", "תאריך התחלת הקורס", "תעריף נסיעות", "סמל קורס"]],
                        [
                            { wch: 15 },
                            { wch: 15 }

                        ])
                },
                icon: <FileDownloadOutlinedIcon />

            },{type:"divider"},
            {
                text: "PDFמורות ל",
                onClick: () => {
                    navigate("/printInformation", { state: { data: t, title: "פרטי מורות", fields: ["firstName", "lastName", "tz", "workerNum", "address", "phone", "email", "password"], headers: ["שם פרטי", "שם משפחה", "תז", "מספר עובד", "כתובת", "טלפון", "מייל", "סיסמא"] } })

                },
                icon: <PictureAsPdfOutlinedIcon />

            }, {
                text: "PDFמורות וקורסים ל",
                onClick: () => {
                    navigate("/printInformation", { state: { data: tWithCourses, title: "פרטי מורות וקורסים", fields: ["firstName", "lastName", "tz", "workerNum",  "email",  "name", 'description', "symbol",  "fares", ], headers: ["שם פרטי", "שם משפחה", "תז", "מספר עובד", "מייל", "שם", "תאור", "סמל קורס", "תעריף נסיעות"] } })

                },
                icon: <PictureAsPdfOutlinedIcon />

            }
        ]} />
        {/* <Link to="/printInformation"  >פרטי מורותPDF</Link>
        <Link to="/printInformation" onClick={() => { alert("hello") }} state={{ data: tWithCourses, title: "פרטי מורות וקורסים", fields: ["firstName", "lastName", "tz", "workerNum", "address", "phone", "email", "password"], headers: ["שם פרטי", "שם משפחה", "תז", "מספר עובד", "כתובת", "טלפון", "מייל", "סיסמא"] }}>פרטי מורותPDF</Link>
    */}
        <Outlet />
        <Box sx={{ flexGrow: 1 }}>
            <TextField
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


            <Typography sx={{ mt: 4, mb: 2 }} variant="h5" component="div">
                מורות
            </Typography>
            {isLoading && <Box sx={{ display: "block", width: '100%' }}><LinearProgress /></Box>}
            <Demo>
                <List dense={false} dir="ltr">
                    {filteredTeacherList.map(item => {
                        return <TeacherListItem withReports={false} editFare={updateFare} deleteTeacherFromCourse={deleteTeacherFromCourse} key={item._id} editTeacher={() => { setEditTeacherDialogVisible(item) }} deleteTeacher={deleteTeacher} item={item} />
                    })}
                </List>
            </Demo>

        </Box>

        <EditTeacherDialog teacher={editTeacherDialogVisible} saveChanges={saveUpdateChanges} handleClose={() => { setEditTeacherDialogVisible(null) }} />
    </div>

    );
}