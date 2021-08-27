const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MeetingSchema = new Schema({
    authorId: {
        type: String,
        required: true
    },
    eventTitle: {
        type: String,
        required: true
    },
    eventDescription: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now(),
        required: true
    }
});

module.exports = TrainingDay = mongoose.model("Meeting", MeetingSchema);