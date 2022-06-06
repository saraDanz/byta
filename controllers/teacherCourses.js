const mongoose = require("mongoose");
// const Course = require("../models/course").courseModel;
// const User = require("../models/user").userModel;
const TeacherCourses = require("../models/teachersCourses").teachersCoursesModel;
const getAllTeacherCourses = async (req, res) => {
    try {

        const teachersCourses = await TeacherCourses.find().populate("courseId").populate("teacherId");
        return res.send(teachersCourses);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }

}
const getCoursesByTeacherId = async (req, res) => {
    try {
        let { teacherId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(teacherId))
            return res.status(400).send("teacher id is not valid");
        const courses = await TeacherCourses.find({ teacherId }).select("-_id -teacherId").populate({ path: "courseId" });
        return res.send(courses);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }

}
const addTeacherToCourse = async (req, res) => {
    try {
        let { teacherId, courseId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(teacherId))
            return res.status(400).send("teacher id is not valid");

        if (!mongoose.Types.ObjectId.isValid(courseId))
            return res.status(400).send("course id is not valid");
        let teacherInCourse = await TeacherCourses.findOne({ courseId, teacherId });
        if (teacherInCourse)
            return res.status(400).send("teacher already exists in this course");

        teacherInCourse = new TeacherCourses({ courseId, teacherId });
        await teacherInCourse.save();
        return res.send(teacherInCourse);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }

}
const deleteTecherFromCourse = async (req, res) => {
    try {
        let { teacherId, courseId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(teacherId))
            return res.status(400).send("teacher id is not valid");

        if (!mongoose.Types.ObjectId.isValid(courseId))
            return res.status(400).send("course id is not valid");
        let teacherInCourse = await TeacherCourses.findOne({ courseId, teacherId });
        if (!teacherInCourse)
            return res.status(400).send("teacher dosn'et exists on this course");
        //check
        //יש לבדוק שאין דיווחים על מורה בקורס זה
        //לבדוק שהמחיקה עובדת
        await teacherInCourse.findOneAndDelete({ courseId, teacherId })
        return res.send(teacherInCourse);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }

}
module.exports = { getCoursesByTeacherId, addTeacherToCourse, getAllTeacherCourses, deleteTecherFromCourse }
// const addTeacherToCoure = async (req, res) => {
//     try {
//         let { tz, password, firstName, lastName, address, phone, email } = req.body;

//         let user = await User.findOne({ tz });
//         if (user)
//             return res.status(409).send("user already exists");

//         user = new User({
//             tz, password, firstName, lastName,
//             address,
//             phone,
//             email,
//             role: 2
//         });
//         await user.save();
//         return res.send(user);
//     }
//     catch (e) {
//         return res.status(400).send(e.message);

//     }

// }