// External Module
const express = require("express");
const hostRouter = express.Router();

// Local Modules
const hostController = require("../controllers/hostController");
const { protect } = require("../middleware/authMiddleware"); // ✅ import protect middleware

// Table Routes (secured)
hostRouter.get("/add-table", protect, hostController.getAddTable);
hostRouter.post("/add-table", protect, hostController.postAddTable);

// Table List Route (secured)
hostRouter.get("/host-table-list", protect, hostController.getHostTables);

// Data for React booking form (secured)
hostRouter.get("/book-table-data", protect, hostController.getBookTable);



hostRouter.delete("/delete-table/:id", protect, hostController.deleteTable);
hostRouter.put("/update-table/:id", protect, hostController.updateTable);
module.exports = hostRouter;
