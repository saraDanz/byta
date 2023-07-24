const router = require("express").Router();
const variablesController = require("../controllers/variable");

router.get("/:name/:key", variablesController.getLastVariableByFieldName);
router.get("/", variablesController.getVariables);
router.post("", variablesController.addNewVariable);

module.exports = router;