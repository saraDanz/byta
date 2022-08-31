import { Menu, Segment, Icon } from 'semantic-ui-react'
import { Link } from "react-router-dom";

import { Tooltip } from "@mui/material";
const ManagerNavBar = () => {
    return <>
        <Tooltip title={"excel הורדה לקובץ"} > <Menu.Item >
            <Link to="exportManager"><Icon name="download" /></Link></Menu.Item>
        </Tooltip>
        <Menu.Item >
            <Link to="setting" title="הגדרות"><Icon name="setting" /></Link>
        </Menu.Item>
        <Menu.Item >
            <Link to="directorList" title="רכזות"><Icon name="setting" /></Link>
        </Menu.Item>
    </>
}
export default ManagerNavBar;