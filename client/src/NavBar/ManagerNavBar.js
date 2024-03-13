import { Menu, Segment } from 'semantic-ui-react'
import { Link } from "react-router-dom";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Tooltip } from "@mui/material";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';

const ManagerNavBar = () => {
    return <>
        <Menu.Item >     <Link to="addCourse" >הוספת קורס</Link></Menu.Item>
        <Menu.Item >     <Link to="addTeacherToCourse" >הוספת מורה לקורס</Link></Menu.Item>
        <Menu.Item >     <Link to="teacherList" >מורות</Link></Menu.Item>
        <Menu.Item >     <Link to="courseList" >קורסים</Link></Menu.Item>
        <Menu.Item >
            <Link to="directorList" title="רכזות">רכזות</Link>
        </Menu.Item>
        <Menu.Item >
            <Link to="tableManager" title="הורדת דיווחים">
                <FileDownloadOutlinedIcon />
            </Link></Menu.Item>

        <Menu.Item >
            <Link to="setting" title="הגדרות"><SettingsOutlinedIcon /></Link>
        </Menu.Item>
       <Menu.Item >
            <Link to="variableList" title="משתני מערכת"><DataObjectOutlinedIcon /></Link>
      </Menu.Item>

    </>
}
export default ManagerNavBar;
