const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    tz: String,
    address: String,
    phone: String,
    email: String,
    password: String,
    role: Number,
    workerNum:Number,
    // years: { type: [Number], default: [] },
    status:{ type: Boolean, default: true}


});
const userModel = mongoose.model("users", userSchema);
module.exports = {
    userSchema,
    userModel
}
