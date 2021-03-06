import React, { useEffect } from "react";
// import 'semantic-ui-css/semantic.min.css'
import DemoApp from "./DemoApp.jsx";
import { Routes, Route, useNavigate } from "react-router";
import DirectorMenu from "./DirectorMenu.js";
import { Link } from "react-router-dom";
import Login from "./Login.js";
import AddTeacher from "./AddTeacher.js";
import AddCourse from "./AddCourse.js";
import AddTeacherToCourse from "./AddTeacherToCourse";
import { useSelector, useDispatch } from "react-redux";
import { logOut, saveUser } from "./store/actions/index.js";
import ExportToExcel from "./ExportToExcel.js";
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
import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
// import { AppBar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Avatar, Typography } from "@mui/material";
import DisplayCalendar from "./DisplayCalendar";
export default function App() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    let user = useSelector(st => st.currentUser);
    let dispatch = useDispatch();

    let navigate = useNavigate();
    const logOutf = () => {
        dispatch(logOut());
        navigate("/login")
        removeStorage();
    }
    useEffect(() => {
        dispatch(saveUser(getStorage()));
        // <Menu.Item >     <Link to="displayCalendar" >???????????? ????????????</Link></Menu.Item>
        //
// 
    }, []);

    return (<>
        <Menu pointing secondary>

            {/*  <Menu.Item >
                <Link to="login">??????????</Link>
          </Menu.Item>*/}


            {user && <> <Menu.Item >  <Link to="displayCalendar">???????? ????????</Link></Menu.Item>

            </>        }





            {user && user.role !=1 && <>
                {/*   <Menu.Item >      <Link to="addUser" >?????????? ??????????</Link></Menu.Item>*/}
                <Menu.Item >     <Link to="addCourse" >?????????? ????????</Link></Menu.Item>
                <Menu.Item >     <Link to="addTeacherToCourse" >?????????? ???????? ??????????</Link></Menu.Item>
                <Menu.Item >     <Link to="teacherList" >??????????</Link></Menu.Item>
                <Menu.Item >     <Link to="courseList" >????????????</Link></Menu.Item>

                <Menu.Item >     <Link to="export" title="excel ?????????? ??????????"><Icon name="download" /></Link></Menu.Item>

            </>}

           
            <Menu.Item position="left">
            {user &&
                <Typography >
                    {user.firstName}
                </Typography>}
                <Avatar sx={{ bgcolor: "orange", width: 30, height: 30 }} >
                    <AccountCircleIcon onClick={handleClick} />
                </Avatar>

            </Menu.Item>


        </Menu>
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
                <Avatar />  ??????????
            </MenuItem></Link>

            {user && <Divider />}
            {user && user.role !=1 && <Link to="addUser" > <MenuItem>
                <ListItemIcon>
                    <PersonAdd fontSize="small" />
                </ListItemIcon>
                ?????????? ????????
 
            </MenuItem></Link>}

            {user && <MenuItem onClick={logOutf}>
                <ListItemIcon >
                    <Logout fontSize="small" />
                </ListItemIcon>
                ??????????
        </MenuItem>}
        </M>



        <Routes>
          
            <Route path="login" element={<Login />} />

            <Route path="director" element={<TeacherList />} />
            <Route path="export" element={<ExportToExcel />} />
            <Route path="addUser" element={<AddTeacher />} />
            <Route path="addCourse" element={<AddCourse />} />
            <Route path="teacherList" element={<TeacherList />} />
            <Route path="courseList" element={<CourseList />} />
            <Route path="displayCalendar" element={<DisplayCalendar />} />
            <Route path="addTeacherToCourse" element={<AddTeacherToCourse />} />





        </Routes>


    </>);
}