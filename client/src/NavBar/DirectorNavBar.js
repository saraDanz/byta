import { Menu, Segment, Icon } from 'semantic-ui-react'
import { Link } from "react-router-dom";
const DirectorNavBar = () => {
    return <><Menu.Item >     <Link to="addCourse" >הוספת קורס</Link></Menu.Item>
        <Menu.Item >     <Link to="addTeacherToCourse" >הוספת מורה לקורס</Link></Menu.Item>
        <Menu.Item >     <Link to="teacherList" >מורות</Link></Menu.Item>
        <Menu.Item >     <Link to="courseList" >קורסים</Link></Menu.Item>
    </>
}
export default DirectorNavBar;