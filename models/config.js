const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({

    setDate: { type: Date, default: Date.now() },
    month: Number,
    year: Number,
    isOpen: Boolean,//או פתוח או סגור
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },

});
const configModel = mongoose.model("configs", configSchema);
module.exports = {
    configModel,
    configSchema
}
