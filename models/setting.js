const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({

    setDate: { type: Date, default: Date.now() },
    changeDate: { type: Date, default: Date.now() },
    monthToBeChanged: Number,
    yearToBeChanged: Number,
    changeStatus: String,//או פתוח או סגור
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },

});
const settingModel = mongoose.model("settings", settingModel);
module.exports = {
    settingModel,
    settingSchema
}
