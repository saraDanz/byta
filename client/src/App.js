import React, { useEffect } from "react";
// import 'semantic-ui-css/semantic.min.css'

import { Routes, Route, useNavigate } from "react-router";

import { Link } from "react-router-dom";
import Login from "./Login.js";
import AddTeacher from "./AddTeacher.js";
import AddCourse from "./AddCourse.js";
import AddTeacherToCourse from "./AddTeacherToCourse";
import { useSelector, useDispatch } from "react-redux";
import { logOut, saveUser } from "./store/actions/index.js";
import ExportToExcel from "./ExportToExcel/ExportToExcel";
import { Menu, Segment, Icon } from 'semantic-ui-react'
import { removeStorage, getStorage } from "./storageUtils.js";
import TeacherList from "./TeacherList.js";
import CourseList from "./CourseList.js";
import Box from '@mui/material/Box';
// import Avatar from '@mui/material/Avatar';
import M from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import AAAcopy from "./AAAcopy";
import PersonAdd from '@mui/icons-material/PersonAdd';
import Setting from './Setting';
import Logout from '@mui/icons-material/Logout';
import DirectorList from "./DirectorList";
// import { AppBar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Avatar, Typography } from "@mui/material";
import DisplayCalendar from "./DisplayCalendar";
import ExportToExcelManager from "./ExportToExcel/ExportToExcelManager.js";
import NavBar from "./NavBar/NavBar.js";
import axios from "axios";
import { BASE_URL } from "./VARIABLES.js";
import { saveCurrentStatus } from "./store/actions/setting.js";
import ReportDataManager from "./ExportToExcel/ReportDataManager"
export default function App() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    let user = useSelector(st => st.index.currentUser);
    let dispatch = useDispatch();

    let navigate = useNavigate();
    const logOutf = () => {
        dispatch(logOut());
        navigate("/login")
        removeStorage();
    }
    useEffect(() => {
        dispatch(saveUser(getStorage()));
        axios.get(`${BASE_URL}settings/currentStatus`).then(res => {
            dispatch(saveCurrentStatus(res.data))

        }).
            catch(err => {
                console.log(err);
                alert("תקלה בקליטת ההגדרות")
            })

    }, []);

    return (<>
        <NavBar user={user} handleMenuClick={handleClick} />
        {/* <Menu pointing secondary>

       


            {user && <> <Menu.Item >  <Link to="displayCalendar">הגשת דווח</Link></Menu.Item>

            </>}





            {user && user.role != 1 && <>
        
                <Menu.Item >     <Link to="addCourse" >הוספת קורס</Link></Menu.Item>
                <Menu.Item >     <Link to="addTeacherToCourse" >הוספת מורה לקורס</Link></Menu.Item>
                <Menu.Item >     <Link to="teacherList" >מורות</Link></Menu.Item>
                <Menu.Item >     <Link to="courseList" >קורסים</Link></Menu.Item>

              

            </>}
            {user && user.role == 2 && <Menu.Item ><Link to="export" title="excel הורדה לקובץ"><Icon name="download" /></Link></Menu.Item>}
            {user && user.role == 3 && <> <Menu.Item ><Link to="exportManager" title="excel הורדה לקובץ"><Icon name="download" /></Link></Menu.Item>
                <Menu.Item >     <Link to="support" title="הגדרות">הגדרות</Link></Menu.Item></>}


            <Menu.Item position="left">
                {user &&
                    <Typography >
                        {user.firstName}
                    </Typography>}
                <Avatar sx={{ bgcolor: "orange", width: 30, height: 30 }} >
                    <AccountCircleIcon onClick={handleClick} />
                </Avatar>

            </Menu.Item>


        </Menu>*/}
        <M
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                    },
                    '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <Link to="login"><MenuItem>
                <Avatar />  כניסה
            </MenuItem></Link>

            {user && <Divider />}
            {user && user.role != 1 && <Link to="addUser" > <MenuItem>
                <ListItemIcon>
                    <PersonAdd fontSize="small" />
                </ListItemIcon>
                הוספת מורה

            </MenuItem></Link>}

            {user && <MenuItem onClick={logOutf}>
                <ListItemIcon >
                    <Logout fontSize="small" />
                </ListItemIcon>
                יציאה
            </MenuItem>}
        </M>



        <Routes>

            <Route path="login" element={<Login />} />


            <Route path="directorList" element={<DirectorList />} />
            <Route path="tableManager" element={<ReportDataManager />} />
            <Route path="export" element={<ExportToExcel />} />
            <Route path="exportManager" element={<ExportToExcelManager />} />
            <Route path="setting" element={<Setting />} />
            <Route path="addUser" element={<AddTeacher />} />
            <Route path="addCourse" element={<AddCourse />} />
            <Route path="teacherList" element={<TeacherList />} />
            <Route path="courseList" element={<CourseList />} />
            <Route path="displayCalendar" element={<AAAcopy />} />
            <Route path="addTeacherToCourse" element={<AddTeacherToCourse />} />





        </Routes>


    </>);
}