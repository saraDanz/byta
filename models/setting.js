const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({

    setDate: { type: Date, default: Date.now() },
    //changeDate: { type: Date, default: Date.now() },
    monthToBeChanged: Number,
    yearToBeChanged: Number,
    changeType: { String, enum: ["all", "month"] },
    changeStatus: String,//או פתוח או סגור
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },

});
const settingModel = mongoose.model("settings", settingSchema);
module.exports = {
    settingModel,
    settingSchema
}
