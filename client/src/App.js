import React from "react";
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
import { logOut } from "./store/actions/index.js";
import ExportToExcel from "./ExportToExcel.js";
import { Menu, Segment, Icon } from 'semantic-ui-react'
// import { AppBar } from '@mui/material';
export default function App() {
    let user = useSelector(st => st.currentUser);
    let dispatch = useDispatch();

    let navigate = useNavigate();
    const logOutf = () => {
        dispatch(logOut());
        navigate("/login")
    }
    return (<>
        <Menu pointing secondary>

            <Menu.Item >        <Link to="login">כניסה</Link>        </Menu.Item>

            {user && <Menu.Item >  <Link to="report">הגשת דווח</Link></Menu.Item>}





            {user && user.role == 2 && <>
                <Menu.Item >      <Link to="addUser" >הוספת משתמש</Link></Menu.Item>
                <Menu.Item >     <Link to="addCourse" >הוספת קורס</Link></Menu.Item>
                <Menu.Item >     <Link to="addTeacherToCourse" >הוספת מורה לקורס</Link></Menu.Item>

                <Menu.Item >     <Link to="export" title="excel הורדה לקובץ"><Icon name="download" /></Link></Menu.Item>

            </>}
            {user && <Menu.Item name='יציאה' onClick={logOutf} position='right' />}

        </Menu>



        <Routes>
            <Route path="report" element={<DemoApp />} />
            <Route path="login" element={<Login />} />

            <Route path="director" element={<DirectorMenu />} />
            <Route path="export" element={<ExportToExcel />} />
            <Route path="addUser" element={<AddTeacher />} />
            <Route path="addCourse" element={<AddCourse />} />
            <Route path="addTeacherToCourse" element={<AddTeacherToCourse />} />





        </Routes>


    </>);
}