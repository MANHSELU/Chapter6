const BookingModel = require("../model/bookingModels");
const RoomModel = require("../model/roomModel");

module.exports.bookingRoom = async (req, res) => {
  try {
    const { customer_Id, room_Id, check_InDate, check_OutDate } = req.body;
    const room = await RoomModel.findById(room_Id);
    if (!room) {
      return res.status(400).json({ message: "Phòng không tồn tại" });
    }
    const conflict = await BookingModel.findOne({
      roomId: room_Id,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        {
          checkInDate: { $lt: new Date(check_OutDate) },
          checkOutDate: { $gt: new Date(check_InDate) },
        },
      ],
    });
    if (conflict) {
      return res
        .status(400)
        .json({ message: "Phòng đã có người đặt trong thời gian này" });
    }
    const booking = new BookingModel({
      customerId: customer_Id,
      roomId: room_Id,
      checkInDate: check_InDate,
      checkOutDate: check_OutDate,
      status: "pending",
    });
    await booking.save();
    res.status(200).json({ message: "Đặt phòng thành công" });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.cancelBooking = async (req, res) => {
  try {
    const { booking_Id } = req.body;
    const booking = await BookingModel.findById(booking_Id);
    if (!booking) {
      return res.status(400).json({ message: "Không tìm thấy lịch đặt" });
    }
    const now = new Date();
    if (booking.checkInDate <= now) {
      return res.status(400).json({
        message: "Không thể hủy, đã đến ngày nhận phòng hoặc đã qua",
      });
    }
    booking.status = "cancelled";
    await booking.save();
    res.status(200).json({ message: "Hủy đặt phòng thành công", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.getBookings = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const total = await BookingModel.countDocuments();
    if (total === 0) {
      return res.status(200).json({ message: "Chưa có đơn đặt phòng nào." });
    }
    const bookings = await BookingModel.find()
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      bookings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports.getBookingsByDate = async (req, res) => {
  try {
    const { checkInDate, checkOutDate } = req.query;
    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ ngày." });
    }
    const startDate = new Date(checkInDate);
    startDate.setHours(0, 0, 0, 0); // đầu ngày
    const endDate = new Date(checkOutDate);
    endDate.setHours(23, 59, 59, 999); // cuối ngày
    if (startDate >= endDate) {
      return res
        .status(400)
        .json({ message: "checkInDate phải nhỏ hơn checkOutDate." });
    }
    const bookings = await BookingModel.find({
      checkInDate: { $lte: endDate },
      checkOutDate: { $gte: startDate },
    });
    if (bookings.length === 0) {
      return res
        .status(200)
        .json({
          message: "Không tìm thấy booking nào trong khoảng thời gian này.",
        });
    }
    res.status(200).json({ bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
