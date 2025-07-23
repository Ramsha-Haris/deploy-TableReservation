// External Module
const express = require("express");
const storeRouter = express.Router();

// Local Module
const storeController = require("../controllers/storeController");

const { protect } = require('../middleware/authMiddleware');


storeRouter.get("/get-all-bookings", protect,storeController.getAllBookings);
storeRouter.get("/book-table", storeController.getBookTable);

// Get booking by ID (for editing)

storeRouter.post("/create-booking", protect,storeController.postCreateBooking);

storeRouter.get("/TableBookingForm/:BookingId?", protect, storeController.getEditBooking);


// Submit edited booking
storeRouter.post("/TableBookingForm", protect,storeController.postEditBooking);

storeRouter.patch("/delete-reservation/:BookingId", protect,storeController.softDeleteReservation);

// storeRouter.js
storeRouter.get('/firstname-suggestions', storeController.getFirstNameSuggestions);

storeRouter.get('/check-table-availability', storeController.checkTableAvailability);

module.exports = storeRouter;
