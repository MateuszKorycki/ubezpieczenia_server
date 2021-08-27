const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArchiveSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
});

module.exports = User = mongoose.model("archives", ArchiveSchema);

