import DirectorNavBar from "./DirectorNavBar";
import ManagerNavBar from "./ManagerNavBar";
import { Menu, Icon } from 'semantic-ui-react'
import { Link } from "react-router-dom";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Tooltip } from "@mui/material";
import TeacherNavBar from "./TeacherNavBar";
const UserNavBar = ({ userRole }) => {
    return (<> 
        {(userRole == 1||userRole==4 )&& <TeacherNavBar />}
        {userRole == 2 && <DirectorNavBar />}
        {userRole == 3 && <ManagerNavBar />}

    </>)

}
export default UserNavBar;
