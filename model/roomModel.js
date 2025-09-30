const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  type: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  capacity: { 
    type: Number, 
    default: 2 
  },
  available: { 
    type: Boolean, 
    default: true 
  },
  description: { 
    type: String 
  }
}, { timestamps: true });

module.exports = mongoose.model("Room", roomSchema);
