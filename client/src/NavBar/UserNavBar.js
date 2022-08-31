import DirectorNavBar from "./DirectorNavBar";
import ManagerNavBar from "./ManagerNavBar";
import { Menu, Icon } from 'semantic-ui-react'
import { Link } from "react-router-dom";

const UserNavBar = ({ userRole }) => {
    return( <>  <Menu.Item >  <Link to="displayCalendar">לוח שנה</Link></Menu.Item>

        {userRole >= 2 && <DirectorNavBar />}
        {userRole == 2 && <Menu.Item >     <Link to="export" title="excel הורדה לקובץ"><Icon name="download" /></Link></Menu.Item>}
        {userRole == 3 && <ManagerNavBar />}
    </>)

}
export default UserNavBar;