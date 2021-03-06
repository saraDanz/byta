const router = require("express").Router();
const teacherCoursesController = require("../controllers/teacherCourses");

router.get("/:teacherId", teacherCoursesController.getCoursesByTeacherId);
router.get("/byDirectorId/:directorId", teacherCoursesController.getCoursesByDirectorId);
router.get("", teacherCoursesController.getAllTeacherCourses);
router.post("", teacherCoursesController.addTeacherToCourse);
//check
router.delete("/:teacherId&:courseId", teacherCoursesController.deleteTecherFromCourse);


module.exports = router;