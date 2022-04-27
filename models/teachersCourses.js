const mongoose = require("mongoose");

const teachersCoursesSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "courses" },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "users" }

});
const teachersCoursesModel = mongoose.model("teachersCourses", teachersCoursesSchema);
module.exports = {
    teachersCoursesSchema,
    teachersCoursesModel
}
