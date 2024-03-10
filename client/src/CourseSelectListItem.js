import "./CourseSelectListItem.css";

export default function CourseSelectListItem({course}){
return <div className="course-select-list-item"><b>{course.name}</b>-<p>{course.description} - {course.symbol}</p></div>
}