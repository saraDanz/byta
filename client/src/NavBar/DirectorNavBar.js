import { Menu, Segment, Icon } from 'semantic-ui-react'
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

const DirectorNavBar = () => {
    return <>
        <Menu.Item >     <Link to="addCourseDirector" >הוספת קורס</Link></Menu.Item>
        <Menu.Item >     <Link to="addTeacherToCourseDirector" >הוספת מורה לקורס</Link></Menu.Item>
        <Menu.Item >     <Link to="teacherListDirector" >מורות</Link></Menu.Item>
        <Menu.Item >     <Link to="teacherListQuickDirector" >  מורות מהיר</Link></Menu.Item>
        <Menu.Item >     <Link to="courseList" >קורסים</Link></Menu.Item>
        <Menu.Item >
            <Link to="tableDirector" title="הורדת דיווחים">
                <FileDownloadOutlinedIcon />
            </Link>
        </Menu.Item>



        {/* <Menu.Item><Link to="">הורדה לאקסל</Link></Menu.Item>*/}
    </>
}
export default DirectorNavBar;