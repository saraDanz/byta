const mongoose = require("mongoose");
const teachersCoursesInYearSchema = new mongoose.Schema({
    fare: Number,
    year: Number,
    associationDate: { type: Date, default: new Date() }





});
const teachersCoursesSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "courses" },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },

    years: { type: [teachersCoursesInYearSchema], default: [] }


});
const teachersCoursesModel = mongoose.model("teachersCourses", teachersCoursesSchema);
module.exports = {
    teachersCoursesSchema,
    teachersCoursesModel
}
