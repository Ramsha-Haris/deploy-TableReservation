const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
  tableCode: { type: Number, required: true },
  tableCapacity: { type: Number, required: true },
  location: { type: String, required: true },
  branch: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model("Tables", TableSchema);
