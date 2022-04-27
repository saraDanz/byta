const mongoose = require("mongoose");
const Course = require("../models/course").courseModel;
const User = require("../models/user").userModel;

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
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
        let { name, description, directorId, startDate, teacherId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(directorId))
            return res.status(400).send("director id is not valid");
        let course = await Course.findOne({ name, directorId });
        console.log(course)
        if (course)
            return res.status(409).send("course with same name and director already exists");



        // if (!mongoose.Types.ObjectId.isValid(teacherId))
        //     return res.status(400).send("teacher id is not valid");
        // const teacher = User.findById(teacherId);
        // if (!teacher)
        //     return res.status(400).send("no such teacher");
        // let course = new Course({ name, description, directorId, startDate: startDate || Date.now(), teachers: [teacherId] })
        course = new Course({ name, description, directorId, startDate: startDate || Date.now() })
        await course.save();
        return res.send(course);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }
}

module.exports = {
    getCourseByName, getCourseById, addNewCourse, getAllCourses
}
