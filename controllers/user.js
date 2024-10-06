const mongoose = require("mongoose");
const User = require("../models/user").userModel;
const TeacherCourses = require("../models/teachersCourses").teachersCoursesModel;
const Course = require("../models/course").courseModel;


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ "lastName": 1, "firstName": 1 });
        return res.send(users);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }
}
const getAllDirectorsAndCourses = async (req, res) => {
    try {
        const directors = await User.find({ role: 2 }).sort({ "lastName": 1, "firstName": 1 });
        const courses = await Course.find();
        const directorsWithCourses = directors.map((data) => {
            let cou = courses.filter(o => o.directorId == data._id.toString());
            let { firstName, lastName, email, password, _id, phone, role, tz, address } = data;
            return { firstName, lastName, email, password, _id, phone, role, tz, address, courses: cou }
        })

        return res.send(directorsWithCourses);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }
}
const getAllDirectors = async (req, res) => {
    try {
        const users = await User.find({ role: 2 }).sort({ "lastName": 1, "firstName": 1 });
        return res.send(users);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }
}
const getAllTeachers = async (req, res) => {
    try {
        const users = await User.find({ role: { $in: [1, 2] } }).sort({ "lastName": 1, "firstName": 1 });
        return res.send(users);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }
}
const getTeachersByDirectorId = async (req, res) => {
    let { directorId } = req.params;
    try {
        let courses = await Course.find({ directorId });
        courses = courses.map(c => c._id);
        let teachersInCourses = await TeacherCourses.find({ courseId: { $in: courses } });
        teachersInCourses = teachersInCourses.map(c => c.teacherId);


        const users = await User.find({ role: { $in: [1, 2] }, _id: { $in: teachersInCourses } }).sort({ "lastName": 1, "firstName": 1 });
        return res.send(users);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }
}
const login = async (req, res) => {
    try {
        let { tz, password } = req.body;
        const user = await User.findOne({ tz, password });
        console.log(user)
        if (!user)
            return res.status(404).send("no such user");
        return res.send(user);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }

}
const deleteUser = async (req, res) => {
    try {
        let { id

        } = req.params;
        console.log(id)
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).send("not a valid user id");
        const user = await User.findById(id);
        if (!user)
            return res.status(404).send("no such user");
        //האם לבדוק בדיקות שאין לה קורסים ואיין לה דיווחים
        //check
        const coursesForTeacher = await TeacherCourses.find({ teacherId: id }).count();
        console.log(coursesForTeacher)

        if (coursesForTeacher > 0)
            return res.status(400).send("cannot remove user that has already courses");
        const x = await User.findByIdAndDelete(id)
        return res.send(x);
    }
    catch (e) {
        return res.status(400).send(e.message);



    }

}
const updateUser = async (req, res) => {
    //to do  לבדוק שהאי די חוקי
    try {
        let id = req.params.id;
        let { tz, password, firstName, lastName,
            address,
            phone,
            email, role, workerNum
        } = req.body;

        let userkk = await User.findOne({ tz });
        if (userkk && userkk._id != id)
            return res.status(409).send("user with same id already exists");
        if (workerNum) {
            userkk = await User.findOne({ workerNum });
            if (userkk && userkk._id != id)
                return res.status(409).send("user workerNum already exists");
        }
        let updated = await User.findOneAndUpdate({ _id: id }, req.body, { new: true });
        console.log(updated);
        return res.send(updated);
        // User.updateOne({  }, $set({
        //     tz, password, firstName, lastName,
        //     address,
        //     phone,
        //     email,
        //     role
        // }))


        // await user.save();

        // return res.send(user);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }
}

const addNewUser = async (req, res) => {
    try {
        let { tz, password, firstName, lastName,
            address,
            phone,
            email, role, workerNum
        } = req.body;

        let user = await User.findOne({ tz });
        if (user)
            return res.status(409).send("user already exists");
        if (workerNum) {
            user = await User.findOne({ workerNum });
            if (user)
                return res.status(409).send("user workerNum already exists");
        }
        user = new User({
            tz, password, firstName, lastName,
            address,
            phone,
            email,
            role, workerNum
        });
        await user.save();

        return res.send(user);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }
}
const addNewTeacher = async (req, res) => {
    try {
        let { tz, password, firstName, lastName,
            address,
            phone,
            email, workerNum
        } = req.body;

        let user = await User.findOne({ tz });
        if (user)
            return res.status(409).send("user with such id already exists");
        if (workerNum) {
            user = await User.findOne({ workerNum });
            if (user)
                return res.status(409).send("user workerNum already exists");
        }
        user = new User({
            tz, password, firstName, lastName,
            address,
            phone,
            email, workerNum,
            role: 1
        });
        await user.save();

        return res.send(user);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }
}
const addNewDirector = async (req, res) => {
    try {
        let { tz, password, firstName, lastName, address, phone, email, workerNum } = req.body;

        let user = await User.findOne({ tz });
        console.log(user);
        if (user)
            return res.status(409).send("user already exists");
        if (workerNum) {
            user = await User.findOne({ workerNum });
            if (user)
                return res.status(409).send("user workerNum already exists");
        }
        user = new User({
            tz, password, firstName, lastName,
            address,
            phone,
            email,
            role: 2, workerNum
        });
        await user.save();
        return res.send(user);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }

}
const getTotalTeacherPages = async (req, res) => {
let {s}=req.query;
    try {
        const count = await User.countDocuments({ role: { $in: [1, 2] },
            $or: [
                { firstName: { $regex: s, $options: "i" } },
                { lastName: { $regex: s, $options: "i" } },
                {
                  $expr: {
                    $regexMatch: {
                      input: { $concat: ["$firstName", " ", "$lastName"] },
                      regex: s,
                      options: "i"
                    }
                  }
                }
              ]
        })
        console.log(Math.ceil(count / 30))
        return res.status(200).json({totalPages:Math.ceil(count / 30)})
    }
    catch (e) {
        return res.status(400).send(e.message);
    }


}
module.exports = {
    login, addNewTeacher,
    getAllDirectorsAndCourses,
    getTeachersByDirectorId,
    getAllUsers, updateUser,
    addNewUser, addNewDirector,
    deleteUser, getAllTeachers,
    getAllDirectors,getTotalTeacherPages
}
