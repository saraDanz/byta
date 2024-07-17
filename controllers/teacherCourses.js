const Course = require("../models/course").courseModel;
const Report = require("../models/report").reportModel;
const mongoose = require("mongoose");
const TeacherCourses = require("../models/teachersCourses").teachersCoursesModel;
const User = require("../models/user").userModel;
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
        /* 
              // const teachersCourses = await TeacherCourses.find({},{fares:{$slice:-1}}).populate("courseId").populate("teacherId");
              const teachersCourses = await TeacherCourses.find({}).populate("courseId").populate("teacherId");

              let teachers = new Map();
              teachersCourses.forEach((item, index) => {
                  if (!item.teacherId || !item.courseId) { console.log(index); return; }
                  let { status, lessonDuration, symbol, description, name, startDate, directorId, _id }=item.courseId;
                  if (!teachers.has[item.teacherId])
                      teachers.set(item.teacherId, [{status, lessonDuration,  symbol, description, name, startDate, directorId, _id , fares: item.fares }])
                  else
                      teachers.set(item.teacherId, [...teachers.get(item.teacherId), { status, lessonDuration,  symbol, description, name, startDate, directorId, _id , fares: item.fares }]);

              })

              let arr = [];
              // for (let x in teachers)
              //     arr.push({...teachers[x][0], courses: [,...teachers[x]] })
              // console.log(teachers)
              for (const [key, value] of teachers) {

                  // console.log(key, value);
                  let { _id,
                      firstName,
                      lastName,
                      tz,
                      address,
                      phone,
                      email,
                      password,
                      role } = key;
                  arr.push({
                      _id,
                      firstName,
                      lastName,
                      tz,
                      address,
                      phone,
                      email,
                      password,
                      role
                      , courses: value
                  })

              }
              const users = await User.find({ role: { $in: [1, 2] } }).sort({ "lastName": 1, "firstName": 1 });


              return res.send(arr);*/
         const [users,teachersCourses]=await Promise.all([User.find({ role: { $in: [1, 2] } }).sort({ "lastName": 1, "firstName": 1 }),TeacherCourses.find().populate("courseId").populate("teacherId")])

        let arr = users.map((item) => {
            let { _id,
                firstName,
                lastName,
                tz,
                address,
                phone,
                email,
                password,
                role,workerNum } = item;
            return {
                _id,
                firstName,
                lastName,
                tz,
                address,
                phone,
                email,
                password,
                role,workerNum,
                courses: teachersCourses.filter((a) => {
                    if (a.teacherId && a.teacherId._id.toString() == item._id.toString()) return true; return false
                }).map((x, index) => {


                    let { status, lessonDuration, symbol, description, name, startDate, directorId, _id } = x.courseId;
                    return { status, lessonDuration, symbol, description, name, startDate, directorId, _id, fares: x.fares }
                })
            }
        })
        return res.send(arr);

    }
    catch (e) {
        return res.status(400).send(e.message);

    }

}
const getAllTeacherWithTheirCoursesOldGoodButSlow = async (req, res) => {
    //פונקציה זו בוריאציה הקודמת טובה יותר , רק כעת באופן זמני
    //שלפתי לזהבה עבור כל מורה וכל קורס כמה דיווחים יש בו
    try {

        // const users = await 
        // const reports = await Report.find();
        // const teachersCourses = await TeacherCourses.find().populate("courseId").populate("teacherId");
const [users,reports,teachersCourses]=await Promise.all([User.find({ role: { $in: [1, 2] } }).sort({ "lastName": 1, "firstName": 1 }), Report.find(),TeacherCourses.find().populate("courseId").populate("teacherId")])
        let arr = users.map((item) => {
            let { _id: _idOfTeacher,
                firstName, lastName, tz, address, phone, email, password, role, workerNum } = item;
            return {
                _id: _idOfTeacher, firstName, lastName, tz, address, phone, email, password, role, workerNum,
                numReports: reports.filter((item) => item.teacherId.toString() == _idOfTeacher.toString()).length,
                courses: teachersCourses.filter((a) => {
                    if (a.teacherId && a.teacherId._id.toString() == item._id.toString()) return true; return false
                }).map((x, index) => {

                    if (!x.courseId) { console.log(index, x)  }
                  else{  let { status, lessonDuration, symbol, description, name, startDate, directorId, _id } = x.courseId;
                    return {
                        status, lessonDuration, symbol, description, name, startDate, directorId, _id, fares: x.fares,
                        numReports: reports.filter((item) => item.teacherId.toString() == _idOfTeacher.toString() && item.courseId.toString() == _id.toString()).length
                    }}
                })
            }
        })
        return res.send(arr);
    }
    catch (e) {
        return res.status(400).send(e.message);
    }
}

const getAllTeacherByDirectorIdWithTheirCourses = async (req, res) => {
    //פונקציה זו בוריאציה הקודמת טובה יותר , רק כעת באופן זמני
    //שלפתי לזהבה עבור כל מורה וכל קורס כמה דיווחים יש בו
    let { directorId } = req.params;
    try {
        let courses = await Course.find({ directorId });
        courses = courses.map(c => c._id);
        let teachersInCourses = await TeacherCourses.find({ courseId: { $in: courses } }).populate("teacherId").populate("courseId");




        let teachers = new Map();
        teachersInCourses.forEach((item, index) => {
            if (!item.teacherId || !item.courseId) { console.log(index); return; }
            let { status, lessonDuration, symbol, description, name, startDate, directorId, _id } = item.courseId;
            if (!teachers.has(item.teacherId))
                teachers.set(item.teacherId, [{ status, lessonDuration, symbol, description, name, startDate, directorId, _id, fares: item.fares }])
            else
                teachers.set(item.teacherId, [...teachers.get(item.teacherId), { status, lessonDuration, symbol, description, name, startDate, directorId, _id, fares: item.fares }]);

        })

        let arr = [];

        for (const [key, value] of teachers) {


            let { _id, firstName, lastName, tz, address, phone, email, password, role } = key;
            arr.push({
                _id, firstName, lastName, tz, address, phone, email, password, role, courses: value
            })

        }
        arr.sort((a, b) => { return a.lastName + " " + a.firstName > b.lastName + " " + b.firstName ? 1 : -1 })
        return res.send(arr);
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
        let c = courses.map(item => item.courseId)
        return res.send(c);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }

}
// const addTeacherToCourse = async (req, res) => {
//     try {
//         let { teacherId, courseId, fare } = req.body;
//         if (!mongoose.Types.ObjectId.isValid(teacherId))
//             return res.status(400).send("teacher id is not valid");

//         if (!mongoose.Types.ObjectId.isValid(courseId))
//             return res.status(400).send("course id is not valid");
//         let teacherInCourse = await TeacherCourses.findOne({ courseId, teacherId });
//         if (teacherInCourse)
//             return res.status(400).send("teacher already exists in this course");

//         teacherInCourse = new TeacherCourses({ courseId, teacherId, fare[fare] });
//         await teacherInCourse.save();
//         return res.send(teacherInCourse);
//     }
//     catch (e) {
//         return res.status(400).send(e.message);

//     }

// }
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

        teacherInCourse = new TeacherCourses({ courseId, teacherId, fares: [{ rate: fare, associationDate: new Date() }] });
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
        let reports = await Report.find({ teacherId, courseId });
        if (reports && reports.length)
            return res.status(409).send("cannot remove course from teacher becase there are reports for this association");
        //check
        //יש לבדוק שאין דיווחים על מורה בקורס זה
        //לבדוק שהמחיקה עובדת
        let t = await TeacherCourses.findOneAndDelete({ courseId, teacherId })
        return res.send(t);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }

}
const updateFare = async (req, res) => {
    try {
        let { courseId, teacherId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(courseId))
            return res.status(400).send("courseId is not valid");
        if (!mongoose.Types.ObjectId.isValid(teacherId))
            return res.status(400).send("teacherId is not valid");

        const teacherInCourse = await TeacherCourses.findOne({ courseId, teacherId });
        if (!teacherInCourse)
            return res.status(404).send("no such teacher in course");
        let newFare = { rate: req.body.fare, associationDate: new Date() };
        let updated = await TeacherCourses.findOneAndUpdate({ _id: teacherInCourse._id }, { $push: { fares: newFare } }, { new: true });

        return res.send(newFare);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }

}
module.exports = {
    getCoursesByTeacherId, updateFare,
    getTeacherCoursesByDirectorId,
    getAllTeacherWithTheirCourses, getAllTeacherByDirectorIdWithTheirCourses,
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