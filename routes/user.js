const router = require("express").Router();
const userController = require("../controllers/user");
router.get("", userController.getAllUsers);
router.delete("/:id", userController.deleteUser);
router.get("/directors", userController.getAllDirectors);
router.get("/teachers", userController.getAllTeachers);
router.post("/login", userController.login);
router.post("", userController.addNewUser);
router.put("/:id", userController.updateUser);
router.post("/newDirector", userController.addNewDirector);
router.post("/newTeacher", userController.addNewTeacher);

module.exports = router;