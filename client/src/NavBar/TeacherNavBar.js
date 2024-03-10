import { Menu, Segment, Icon } from 'semantic-ui-react'
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

const TeacherNavBar = () => {
    return (
        <>  <Menu.Item >  <Link to="displayCalendar">לוח שנה</Link></Menu.Item>
             {/*<Menu.Item >
               <Link to="tableTeacher" title="הורדת דיווחים">
                    <FileDownloadOutlinedIcon />
    </Link></Menu.Item>*/}</>
    )
}
export default TeacherNavBar;