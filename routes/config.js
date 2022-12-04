const router = require("express").Router();
const configController = require("../controllers/config");

router.get("/byYear/:year", configController.getConfigsByYear);
router.post("", configController.addNewconfig);

module.exports = router;