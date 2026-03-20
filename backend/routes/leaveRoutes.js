const express = require("express");
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} = require("../controllers/leaveController");

router.post("/apply", applyLeave);
router.get("/my/:userId", getMyLeaves);
router.get("/all", getAllLeaves);
router.put("/:id", updateLeaveStatus);

module.exports = router;
