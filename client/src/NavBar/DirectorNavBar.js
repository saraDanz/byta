import { Menu, Segment, Icon } from 'semantic-ui-react'
import { Link } from "react-router-dom";
import {Tooltip} from "@mui/material";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

const DirectorNavBar = () => {
    return <><Menu.Item >     <Link to="addCourse" >הוספת קורס</Link></Menu.Item>
        <Menu.Item >     <Link to="addTeacherToCourse" >הוספת מורה לקורס</Link></Menu.Item>
        <Menu.Item >     <Link to="teacherList" >מורות</Link></Menu.Item>
        <Menu.Item >     <Link to="courseList" >קורסים</Link></Menu.Item>
        <Menu.Item >
        <Link to="tableDirector">  <Tooltip title={"excel הורדה לקובץ"} >
            <FileDownloadOutlinedIcon />
        </Tooltip></Link></Menu.Item>


       {/* <Menu.Item><Link to="">הורדה לאקסל</Link></Menu.Item>*/}
    </>
}
export default DirectorNavBar;