const mongoose = require("mongoose");
const Course = require("../models/course").courseModel;
const User = require("../models/user").userModel;
const TeacherCourses = require("../models/teachersCourses").teachersCoursesModel;


const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate("directorId", "firstName lastName").populate("teachers").sort({ "name": 1 });
        return res.send(courses);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }
}
const getCourseById = async (req, res) => {
    try {
        let { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).send("id is not valid");
        const course = await Course.findById(id);

        if (!course)
            return res.status(404).send("no such course");
        return res.send(course);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }

}
const deleteCourseById = async (req, res) => {
    try {
        let { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).send("id is not valid");
        const course = await Course.findById(id);
        //לא בדקתי האם כבר משוייכות מורות לקורס זה
        if (!course)
            return res.status(404).send("no such course");
        let count = TeacherCourses.find({ courseId: course._id }).count();
        //check
        if (count > 0)
            return res.status(404).send("teachers already in course");

        const y = await Course.findByIdAndDelete(id);
        return res.send(y);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }

}
const getCourseBySymbol = async (req, res) => {
    try {
        let { symbol } = req.params;

        const course = await Course.findOne({ symbol });

        if (!course)
            return res.status(404).send("no such course");
        return res.send(course);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }

}

const getCourseByName = async (req, res) => {
    try {
        let { name } = req.params;

        const course = await Course.findOne({ name });

        if (!course)
            return res.status(404).send("no such course");
        return res.send(course);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }

}

const addNewCourse = async (req, res) => {
    try {
        let { name, description, directorId, startDate, symbol } = req.body;

        if (!mongoose.Types.ObjectId.isValid(directorId))
            return res.status(400).send("director id is not valid");
        let course = await Course.findOne({ name, directorId });
        console.log(course)
        if (course)
            return res.status(409).send("course with same name and director already exists");
        if (symbol) {
            course = await Course.findOne({ symbol });
            console.log(course)
            if (course)
                return res.status(409).send("course with same symbol already exists");
        }

        // if (!mongoose.Types.ObjectId.isValid(teacherId))
        //     return res.status(400).send("teacher id is not valid");
        // const teacher = User.findById(teacherId);
        // if (!teacher)
        //     return res.status(400).send("no such teacher");
        // let course = new Course({ name, description, directorId, startDate: startDate || Date.now(), teachers: [teacherId] })
        course = new Course({ name, description, directorId, startDate: startDate || Date.now(), symbol })
        await course.save();
        return res.send(course);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }
}
const updateCourse = async (req, res) => {
    try {
        let { name, description, directorId, startDate, symbol } = req.body;

        if (!mongoose.Types.ObjectId.isValid(directorId))
            return res.status(400).send("director id is not valid");
        let id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).send("course id is not valid");

        let course = await Course.findOne({ name, directorId });
        console.log(course)
        if (course && course._id != id)
            return res.status(409).send("course with same name and director already exists");
        if (symbol) {
            course = await Course.findOne({ symbol });
            console.log(course)
            if (course && course._id != id)
                return res.status(409).send("course with same symbol already exists");
        }

        course = await Course.findByIdAndUpdate(id, { name, description, directorId, startDate: startDate || Date.now(), symbol }, { new: true }).populate("directorId", "firstName lastName").populate("teachers")
        console.log(course)
        return res.send(course);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }
}

module.exports = {
    getCourseByName, updateCourse,getCourseById, addNewCourse, deleteCourseById, getAllCourses, getCourseBySymbol
}
