const router = require("express").Router();
const courseController = require("../controllers/course");
// router.get("/:year", courseController.getAllCoursesByYear);
router.get("", courseController.getAllCourses);
router.get("/byName/:name", courseController.getCourseByName);
router.get("/byDirectorId/:directorId", courseController.getCoursesByDirectorId);
router.get("/:id", courseController.getCourseById);
router.delete("/:id", courseController.deleteCourseById);
router.get("/bySymbol/:symbol", courseController.getCourseBySymbol);
router.post("", courseController.addNewCourse);
router.put("/:id", courseController.updateCourse);
router.put("/toggleStatusOff/:id", courseController.toggleStatusOff);
// router.put("/addYear/:id", courseController.addYear);
// router.put("/removeYear/:id", courseController.removeYear);







module.exports = router;