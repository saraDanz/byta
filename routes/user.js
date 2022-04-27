const router = require("express").Router();
const userController = require("../controllers/user");
router.get("", userController.getAllUsers);
router.get("/directors", userController.getAllDirectors);
router.post("/login", userController.login);
router.post("", userController.addNewTeacher);
router.post("/newDirector", userController.addNewDirector);

module.exports = router;