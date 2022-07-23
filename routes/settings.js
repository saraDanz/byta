const router = require("express").Router();
const settingsController = require("../controllers/setting");

router.get("/:teacherId", settingsController.getCoursesByTeacherId);
router.post("", settingsController.addTeacherToCourse);



module.exports = router;