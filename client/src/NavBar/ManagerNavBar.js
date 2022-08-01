import { Menu, Segment, Icon } from 'semantic-ui-react'
import { Link } from "react-router-dom";
const ManagerNavBar = () => {
    return <>
        <Menu.Item >     <Link to="export" title="excel הורדה לקובץ"><Icon name="download" /></Link></Menu.Item>
        <Menu.Item >     <Link to="export" title="הגדרות"><Icon name="setting" /></Link></Menu.Item>
    </>
}
export default ManagerNavBar;