const router = require("express").Router();
const settingsController = require("../controllers/setting");

router.get("/all", settingsController.getLastAllStatusChange);
router.get("/currentStatus", settingsController.getComputedCurrentStatus);
router.get("/month", settingsController.getLastMonthChange);
router.post("", settingsController.addNewSetting);



module.exports = router;