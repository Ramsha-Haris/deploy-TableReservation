const Bookings = require("../models/booking");
const setupTable = require("../models/table");

// ✅ No need to check req.session — we now get user from req.user via JWT
exports.getAddTable = (req, res, next) => {
  res.status(200).json({
    pageTitle: "Add Table",
    currentPage: "addTable",
    user: req.user || null, // 👈 req.user is set by JWT middleware
  });
};

exports.postAddTable = async (req, res, next) => {
  try {
    const { tableCode, tableCapacity, location, branch } = req.body;

    const newSetupTable = new setupTable({
      tableCode,
      tableCapacity,
      location,
      branch,
    });

    await newSetupTable.save();

    const registeredTables = await setupTable.find();

    res.status(201).json({
      success: true,
      message: "Table added successfully",
      tables: registeredTables,
    });
  } catch (err) {
    console.error("Error saving table:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

exports.getHostTables = async (req, res, next) => {
  try {
    const registeredTables = await setupTable.find();
    res.status(200).json({
      success: true,
      tables: registeredTables,
    });
  } catch (err) {
    console.error("Error fetching tables:", err);
    res.status(500).json({ success: false, error: "Could not fetch tables" });
  }
};

exports.getBookTable = async (req, res) => {
  try {
    const tables = await setupTable.find();
    res.status(200).json({ success: true, tables });
  } catch (err) {
    console.error("Error fetching table data:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// DELETE /api/host/delete-table/:id
exports.deleteTable= async (req, res) => {
  try {
    const deleted = await setupTable.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.status(200).json({ message: 'Table deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ message: 'Server error while deleting table' });
  }
};

// PUT /api/host/update-table/:id
exports.updateTable= async (req, res) => {
  try {
    const { tableCode, location, tableCapacity, branch } = req.body;

    const updated = await setupTable.findByIdAndUpdate(
      req.params.id,
      { tableCode, location, tableCapacity, branch },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.status(200).json({ message: 'Table updated successfully', table: updated });
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: 'Server error while updating table' });
  }
};



