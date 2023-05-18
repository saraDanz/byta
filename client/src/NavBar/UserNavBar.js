import DirectorNavBar from "./DirectorNavBar";
import ManagerNavBar from "./ManagerNavBar";
import { Menu, Icon } from 'semantic-ui-react'
import { Link } from "react-router-dom";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Tooltip } from "@mui/material";
const UserNavBar = ({ userRole }) => {
    return (<>  <Menu.Item >  <Link to="displayCalendar">לוח שנה</Link></Menu.Item>

        {userRole >= 2 && <DirectorNavBar />}
        {userRole == 2 && <Menu.Item >
            <Link to="tableDirector">  <Tooltip title={"excel הורדה לקובץ"} >
                <FileDownloadOutlinedIcon />
            </Tooltip></Link>
        </Menu.Item>}
        {/*userRole == 2 &&
      
            
            <Menu.Item >       <Link to="export" title="excel הורדה לקובץ">
            <FileDownloadOutlinedIcon /></Link></Menu.Item>
        */}
        {userRole == 3 && <ManagerNavBar />}
    </>)

}
export default UserNavBar;