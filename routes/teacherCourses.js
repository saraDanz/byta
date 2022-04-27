const router = require("express").Router();
const teacherCoursesController = require("../controllers/teacherCourses");

router.get("/:teacherId", teacherCoursesController.getCoursesByTeacherId);
router.get("", teacherCoursesController.getAllTeacherCourses);
router.post("", teacherCoursesController.addTeacherToCourse);


module.exports = router;