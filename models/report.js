const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "courses" },
    date: Date,
    fromTime: Date,
    toTime: Date,
    numHours: Number,
    subject: { type: String, default: "" },
    directorStatus: { type: Boolean, default: false },
    bookKeeperStatus: { type: Boolean, default: false },
    reportDate: { type: Date, default: Date.now() },
    type: { type: String },
    comment: { type: String },
    commited: { type: Boolean, default: false }

});
const reportModel = mongoose.model("reports", reportSchema);
module.exports = {
    reportModel,
    reportSchema
}
