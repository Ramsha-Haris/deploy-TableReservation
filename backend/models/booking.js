const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const reservationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  guestContactDetails: { type: Number, required: true },
  bookingStatus: String,
  bookingType: String,
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  bookingDuration: { type: Number, required: true },
  CapacityCovers: { type: Number, required: true },
  tableName: { type: Array, required: true },
  bookingNotes: String,
  reservationTag: Array,
  bookingNumber: { type: String, unique: true },

  // 👇 New field for soft delete
  isDeleted: { type: Boolean, default: false },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  editedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

});

module.exports = mongoose.model("Bookings", reservationSchema);
