const express = require("express");
const router = express.Router();
const { getAuthorization } = require("../controllers/authorize");
const { protect } = require("../middleware/authorize");

router.route("/").get(protect, getAuthorization);

module.exports = router;
