const router = require("express").Router();
const courseController = require("../controllers/course");
router.get("", courseController.getAllCourses);
router.get("/byName/:name", courseController.getCourseByName);
router.get("/:id", courseController.getCourseById);
router.delete("/:id", courseController.deleteCourseById);
router.get("/bySymbol/:symbol", courseController.getCourseBySymbol);
router.post("", courseController.addNewCourse);






module.exports = router;