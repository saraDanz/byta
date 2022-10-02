import { Menu, Segment } from 'semantic-ui-react'
import { Link } from "react-router-dom";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Tooltip } from "@mui/material";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
const ManagerNavBar = () => {
    return <>
        <Menu.Item >
            <Link to="directorList" title="רכזות">רכזות</Link>
        </Menu.Item>
        <Menu.Item >
            <Link to="tableManager">  <Tooltip title={"excel הורדה לקובץ"} >
                <FileDownloadOutlinedIcon />
            </Tooltip></Link></Menu.Item>

        <Menu.Item >
            <Link to="setting" title="הגדרות"><SettingsOutlinedIcon /></Link>
        </Menu.Item>

    </>
}
export default ManagerNavBar;