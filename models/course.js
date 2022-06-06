const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    directorId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    startDate: { type: Date, default: Date.now() },
    name: String,
    description: String,
    symbol: String,
    teachers: [{ type: mongoose.Types.ObjectId, ref: "users" }]





});
const courseModel = mongoose.model("courses", courseSchema);
module.exports = {
    courseModel,
    courseSchema
}
