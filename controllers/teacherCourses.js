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
const getAllTeacherWithTheirCourses = async (req, res) => {
    try {

        const teachersCourses = await TeacherCourses.find().populate("courseId").populate("teacherId");
        let teachers = {};
        teachersCourses.forEach((item, index) => {
            if (!item.teacherId || !item.courseId) { console.log(index); return; }
            if (!teachers[item.teacherId._id])
                teachers[item.teacherId._id] = [{ teacher: item.teacherId, course: item.courseId }]
            else
                teachers[item.teacherId._id].push({ teacher: item.teacherId, course: item.courseId })
        })



        return res.send(Object.values(teachers));
    }
    catch (e) {
        return res.status(400).send(e.message);

    }

}
const getTeacherCoursesByDirectorId = async (req, res) => {
    try {
        let { directorId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(directorId))
            return res.status(400).send("teacher id is not valid");
        const courses = await TeacherCourses.find({ directorId }).populate({ path: "courseId" });
        return res.send(courses);
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
        let { teacherId, courseId, fare } = req.body;
        if (!mongoose.Types.ObjectId.isValid(teacherId))
            return res.status(400).send("teacher id is not valid");

        if (!mongoose.Types.ObjectId.isValid(courseId))
            return res.status(400).send("course id is not valid");
        let teacherInCourse = await TeacherCourses.findOne({ courseId, teacherId });
        if (teacherInCourse)
            return res.status(400).send("teacher already exists in this course");

        teacherInCourse = new TeacherCourses({ courseId, teacherId, fare });
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
const updateFare = async (req, res) => {
    try {
        let { teacherInCourseId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(teacherInCourseId))
            return res.status(400).send("teacherInCourseId is not valid");

        const teacherInCourse = await TeacherCourses.findById(teacherInCourseId);
        if (!teacherInCourse || !teacherInCourse.length)
            return res.status(404).send("no such teacherCourseId");

        // let updated = await TeacherCourses.findOneAndUpdate({ _id: id }, , { new: true });
        teacherInCourse.fare = req.body.fare;
        await teacherInCourse.save();
        return res.send(teacherInCourse);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }

}
module.exports = {
    getCoursesByTeacherId,updateFare,
    getTeacherCoursesByDirectorId, getAllTeacherWithTheirCourses,
    addTeacherToCourse, getAllTeacherCourses, deleteTecherFromCourse
}
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