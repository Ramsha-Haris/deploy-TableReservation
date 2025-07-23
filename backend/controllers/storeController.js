
const Bookings=require("../models/booking")
const setupTables=require("../models/table")

const { v4: uuidv4 } = require('uuid');



exports.getBookTable = async (req, res, next) => {
  try {
    const tables = await setupTables.find(); // Fetch all tables

    // Send all data as JSON for React frontend
    res.status(200).json({
      pageTitle: 'Book Table',
      currentPage: 'bookTable',
      tables,
      editing: false,
      reservationTags,
      timeSlot,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ message: 'An error occurred while fetching booking data.' });
  }
};


exports.getEditBooking = async (req, res, next) => {
  const BookingId = req.params.BookingId;
  const editing = req.query.editing === 'true';

  try {
    const booking = await Bookings.findById(BookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const tables = await setupTables.find();
    const reservationTags = ['VIP', 'Regular', 'Family', 'Party'];

    res.status(200).json({
      booking,
      tables,
      reservationTags,
      editing,
      isLoggedIn: req.isLoggedIn,
      user: req.user, // coming from your JWT middleware

    });

  } catch (error) {
    console.error("Error finding booking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Bookings.find({ isDeleted: false }); // ✅ Exclude soft-deleted
    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to retrieve bookings" });
  }
};



exports.postCreateBooking = async (req, res, next) => {
  try {
    const now = new Date();
    const formattedDate = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const uniqueId = uuidv4().slice(0, 8);
    const bookingNumber = `${formattedDate}-${uniqueId}`;

    const {
      firstName,
      lastName,
      guestContactDetails,
      bookingStatus,
      bookingType,
      date,
      timeSlot,
      bookingDuration,
      CapacityCovers,
      tableName,
      bookingNotes,
      reservationTag
    } = req.body;

    const newBooking = new Bookings({
      firstName,
      lastName,
      guestContactDetails,
      bookingStatus,
      bookingType,
      date,
      timeSlot,
      bookingDuration,
      CapacityCovers,
      tableName,
      bookingNotes,
      reservationTag,
      bookingNumber,
      createdBy: req.user._id // ✅ Securely assign from auth middleware
    });

    const savedBooking = await newBooking.save();
    res.status(201).json({ message: "Booking created successfully", booking: savedBooking });

  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).json({ message: "Error saving booking" });
  }
};


exports.softDeleteReservation = async (req, res, next) => {
  const { BookingId } = req.params;

  try {
    const booking = await Bookings.findById(BookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.isDeleted) {
      return res.status(400).json({ message: "Booking already deleted" });
    }

    booking.isDeleted = true;
    booking.bookingStatus = "Deleted";
    booking.editedBy = req.user;
    await booking.save();

    res.status(200).json({ message: "Booking soft-deleted successfully", booking });
  } catch (error) {
    console.error("Error soft-deleting booking:", error);
    res.status(500).json({ message: "Error soft-deleting booking", error: error.message });
  }
};



exports.postEditBooking = async (req, res, next) => {
  const {
    id,
    firstName,
    lastName,
    guestContactDetails,
    bookingStatus,
    bookingType,
    date,
    timeSlot,
    bookingDuration,
    CapacityCovers,
    tableName,
    bookingNotes,
    reservationTag,
    bookingNumber
  } = req.body;

  try {
    const booking = await Bookings.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.firstName = firstName;
    booking.lastName = lastName;
    booking.guestContactDetails = guestContactDetails;
    booking.bookingStatus = bookingStatus;
    booking.bookingType = bookingType;
    booking.date = date;
    booking.timeSlot = timeSlot;
    booking.bookingDuration = bookingDuration;
    booking.CapacityCovers = CapacityCovers;
    booking.tableName = tableName;
    booking.bookingNotes = bookingNotes;
    booking.reservationTag = reservationTag;
    booking.bookingNumber = bookingNumber;
    booking.editedBy = req.user;

    const updatedBooking = await booking.save();

    return res
      .status(200)
      .json({ message: "Booking updated successfully", booking: updatedBooking });

  } catch (error) {
    console.error("Error while updating booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// GET /api/firstname-suggestions?q=John
exports.getFirstNameSuggestions = async (req, res) => {
  try {
    const q = req.query.q;

    if (!q || q.trim() === '') {
      return res.status(400).json([]);
    }

    const suggestions = await Bookings.find({
      firstName: { $regex: new RegExp(`^${q}`, 'i') } // starts with, case-insensitive
    })
      .limit(10)
      .select('firstName lastName guestContactDetails -_id'); // select only needed fields

    // Map for consistent frontend naming
    const result = suggestions.map(s => ({
      firstName: s.firstName,
      secondName: s.lastName,
      contact: s.guestContactDetails
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json([]);
  }
};

exports.checkTableAvailability = async (req, res) => {
  const { date, timeSlot } = req.query;
console.log(date,timeSlot);
  if (!date || !timeSlot) {
    return res.status(400).json({ error: 'Date and timeSlot are required' });
  }

  try {
    const bookings = await Bookings.find({ date, timeSlot });
    const bookedCodes = bookings.flatMap(b =>
      Array.isArray(b.tableName) ? b.tableName : [b.tableName]
    );

    console.log('Booked tables:', bookedCodes); // <- Confirm this prints correctly
    res.json({ bookedTableCodes: bookedCodes });
  } catch (err) {
    console.error('Error checking availability:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

