const router = require("express").Router();
const teacherCoursesController = require("../controllers/teacherCourses");

router.get("/byDirectorId/:directorId", teacherCoursesController.getTeacherCoursesByDirectorId);
router.get("", teacherCoursesController.getAllTeacherCourses);
router.get("/withTheirCourses", teacherCoursesController.getAllTeacherWithTheirCourses);
router.get("/:teacherId", teacherCoursesController.getCoursesByTeacherId);
router.put("/updateFare/:courseId/:teacherId", teacherCoursesController.updateFare);

router.post("", teacherCoursesController.addTeacherToCourse);
//check
router.delete("/:teacherId/:courseId", teacherCoursesController.deleteTecherFromCourse);


module.exports = router;