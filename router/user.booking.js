const express = require('express');
const routerUserBooking = express.Router();
const BookingController = require('../controller/bookingController')

routerUserBooking.post("/bookingRoom",BookingController.bookingRoom);
routerUserBooking.delete("/deleteBooking",BookingController.cancelBooking);
routerUserBooking.get("/bookings",BookingController.getBookings);
routerUserBooking.get("/bookingsByDate",BookingController.getBookingsByDate);

module.exports = routerUserBooking;