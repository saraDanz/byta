const mongoose = require("mongoose");
const rateSchema = new mongoose.Schema({
    rate: Number,
  
    associationDate: { type: Date, default: new Date() }





});
const teachersCoursesSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "courses" },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },

    fares: { type: [rateSchema], default: [] },
    rate: { type: [rateSchema], default: [] }


});
const teachersCoursesModel = mongoose.model("teachersCourses", teachersCoursesSchema);
module.exports = {
    teachersCoursesSchema,
    teachersCoursesModel
}
