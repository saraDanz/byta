const router = require("express").Router();
const userController = require("../controllers/user");
router.get("", userController.getAllUsers);
router.get("/totalTeacherPages", userController.getTotalTeacherPages);
router.get("/totalTeacherByDirectorIdPages/:directorId", userController.getTotalTeacherByDirectorIDPages);
router.delete("/:id", userController.deleteUser);
router.get("/directors", userController.getAllDirectors);
router.get("/directorsAndCourses", userController.getAllDirectorsAndCourses);
router.get("/byDirectorId/:directorId", userController.getTeachersByDirectorId);
router.get("/teachers", userController.getAllTeachers);
router.post("/login", userController.login);
router.post("", userController.addNewUser);
router.put("/:id", userController.updateUser);
router.post("/newDirector", userController.addNewDirector);
router.post("/newTeacher", userController.addNewTeacher);

module.exports = router;