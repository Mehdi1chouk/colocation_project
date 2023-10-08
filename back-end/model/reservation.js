const mongoose = require("mongoose");


const reservationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    house: {
        type: String,

    },
    dates: {
        type: Array,
    },
    statut: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const Reservation = mongoose.model("Reservation", reservationSchema);
module.exports = Reservation;