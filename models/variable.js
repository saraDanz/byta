const mongoose = require("mongoose");

const variableSchema = new mongoose.Schema({

    valueType: { type: String, default: 'String' },
    name: String,
    value: String,
    key: String,//או פתוח או סגור
    setDate: { type: Date, default: Date.now() },

});
const variableModel = mongoose.model("fares", variableSchema);
module.exports = {
    variableModel,
    variableSchema
}
