const Leave = require("../models/Leave");

// Apply Leave (Employee)
exports.applyLeave = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;

    const leave = new Leave({
      userId,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    await leave.save();

    res.status(201).json({ message: "Leave applied successfully", leave });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get My Leaves (Employee)
exports.getMyLeaves = async (req, res) => {
  try {
    const { userId } = req.params;

    const leaves = await Leave.find({ userId });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Leaves (Employer)
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate("userId", "name email");

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve / Reject Leave (Employer)
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const leave = await Leave.findByIdAndUpdate(id, { status }, { new: true });

    res.json({ message: "Leave updated", leave });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
