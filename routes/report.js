const router = require("express").Router();
const reportController = require("../controllers/report");
router.get("", reportController.getAllReports);
router.get("/:teacherId", reportController.getAllReportsByTeacherId);
// router.get("getByteacherIdAndYear/:teacherId/:year", reportController.getAllReportsByTeacherIdAndYear);
// router.get("/:teacherId/:year/:month", reportController.getAllReportsByTeacherIdMonthAndYear);
router.get("/byYearAndMonth/:year/:month", reportController.getAllReportsByYearAndMonth);
router.get("/byDirectorIdYearAndMonth/:directorId/:year/:month", reportController.getAllReportsByDirectorIdYearAndMonth);
router.post("", reportController.addReport);
router.post("/addReports", reportController.addReports);
router.get("/searchByParameters/:year/:month/:directorId/:courseId/:teacherId", reportController.searchByParameters);
router.put("",reportController.saveReportChanges);






module.exports = router;