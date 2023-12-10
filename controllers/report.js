const mongoose = require("mongoose");
const Report = require("../models/report").reportModel;
const User = require("../models/user").userModel;
const Course = require("../models/course").courseModel;

const fs = require('fs')

const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find();
        return res.send(reports);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }
}

const getAllReportsByYearAndMonth = async (req, res) => {
    let { year, month } = req.params;
    let first = new Date(year, month - 1, 0, 0, 0, 0, 0, 0);
    // first=new Date(first.getFullYear(),first.getMonth(),first.getDate()-1)
    let last = new Date(year, month, 0, 0, 0, 0, 0);
    console.log(last)
    try {
        const reports = await Report.find({ date: { $gt: first, $lte: last } }).populate({ path: "teacherId", select: "firstName lastName -_id" }).populate({ path: "courseId", populate: { path: "directorId", select: "firstName lastName -_id" } });
        console.log(reports)
        return res.send(reports);
    }

    //    let prev = new Date(year, month, 0);
    //     let next = new Date(year, month+1,0 );
    //         console.log(prev)
    //         console.log(next)

    // try {
    //     const reports = await Report.find({ date: { $gt: prev, $lt: next } }).populate({ path: "teacherId", select: "firstName lastName -_id" }).populate({ path: "courseId", populate: { path: "directorId", select: "firstName lastName -_id" } });
    //     console.log(reports)
    //     return res.send(reports);
    // }

    // try {
    //     const reports = await Report.find({ 
    //         "$expr": { 
    //             "$and": [ 
    //                 { "$eq": [ { "$month": "$date" }, month ] },
    //                 { "$eq": [ { "$year": "$date" }, year ] }
    //             ] 

    //         } 
    //     }).populate({ path: "teacherId", select: "firstName lastName -_id" }).populate({ path: "courseId", populate: { path: "directorId", select: "firstName lastName -_id" } });
    //     console.log(reports)
    //     return res.send(reports);
    // }
    catch (e) {
        return res.status(400).send(e.message);

    }
}
const searchByParameters = async (req, res) => {
    //לא בדקתי לפי מורה וקורס יחד

    let { year, month, directorId, courseId, teacherId, searchFrom, searchTo,type } = req.params;

    // let first = new Date(year, month -1,0,0,0,0,0,0);
    // first=new Date(first.getFullYear(),first.getMonth(),first.getDate()-1)
    // let last = new Date(year, month,0,0,0,0,0);
    // console.log(last)

    // try {
    //     let courses = await Course.find({ directorId }).select("_id");
    //     courses = courses.map(item => item._id);
    //     let reports = await Report.find({ courseId: { $in: courses } }).populate({ path: "teacherId", select: "firstName lastName -_id" }).populate({ path: "courseId", populate: { path: "directorId", select: "firstName lastName -_id" } });
    //     let reportsCnt = await Report.find({ courseId: { $in: courses } }).populate({ path: "teacherId", select: "firstName lastName -_id" }).populate({ path: "courseId", populate: { path: "directorId", select: "firstName lastName -_id" } }).count();
    //     let reportsx = {
    //         repFilter: reports.filter(item => { return item.date && getDateXDaysAgo(1, item.date).getFullYear() == year && getDateXDaysAgo(1, item.date).getMonth() == month - 1 }), rep: reports, reportsCnt
    //     };
    //     console.log(reports)
    //     return res.send(reportsx.repFilter);
    // }

    // let prev = getDateXDaysAgo(1, new Date(year, month-1, 0));
    let prev, next;
    if (searchFrom && searchFrom != "undefined" && searchTo && searchTo != "undefined") {
        prev = getDateXDaysAgo(1, new Date(searchFrom));
        next = new Date(searchTo);
    }
    else {
        prev = new Date(year, month - 1, 0);
        next = new Date(year, month, 0);
    }

    console.log(prev)
    console.log(next)

    try {

        let reports;
        //     if (teacherId && courseId)
        //         reports = await Report.find({ date: { $gt: prev, $lt: next }, teacherId, courseId }).populate({ path: "teacherId", select: "firstName lastName -_id" }).populate({ path: "courseId", populate: { path: "directorId", select: "firstName lastName -_id" } });
        //     else if (teacherId) reports = await Report.find({ date: { $gt: prev, $lt: next }, teacherId }).populate({ path: "teacherId", select: "firstName lastName -_id" }).populate({ path: "courseId", populate: { path: "directorId", select: "firstName lastName -_id" } });
        //     else if (courseId) reports = await Report.find({ date: { $gt: prev, $lt: next }, courseId: courseId }).populate({ path: "teacherId", select: "firstName lastName -_id" }).populate({ path: "courseId", populate: { path: "directorId", select: "firstName lastName -_id" } });
        //    else 
        // let ob = { courseId, teacherId, directorId };
        let ob = { courseId, teacherId, type};
        ob = Object.fromEntries(Object.entries(ob).filter(([_, v]) => v != 'null' && v != 'undefined' && v != null && v != undefined && v != ''));
        reports = await Report.find({ date: { $gt: prev, $lte: next }, ...ob }).populate({ path: "teacherId", select: "firstName lastName tz workerNum -_id " }).populate({ path: "courseId", populate: { path: "directorId", select: "firstName lastName " } });
        reports.forEach((item,index) => {
            if (!item.teacherId)
                console.log(item, index,item.courseId);
        })
        if (directorId != 'null' && directorId != 'undefined' && directorId)
            reports = reports.filter((item) => {

                return !item.courseId || !item.courseId.directorId || item.courseId.directorId._id == directorId;

            });
        //fs.writeFileSync("allreports.json", JSON.stringify(reports), 'utf8')
        console.log(reports)
        return res.send(reports);
    }

    catch (e) {
        return res.status(400).send(e.message);

    }
}
const getAllReportsByDirectorIdYearAndMonth = async (req, res) => {
    let { year, month, directorId } = req.params;
    // let first = new Date(year, month -1,0,0,0,0,0,0);
    // first=new Date(first.getFullYear(),first.getMonth(),first.getDate()-1)
    // let last = new Date(year, month,0,0,0,0,0);
    // console.log(last)

    try {
        let courses = await Course.find({ directorId }).select("_id");
        courses = courses.map(item => item._id);
        let reports = await Report.find({ courseId: { $in: courses } }).populate({ path: "teacherId", select: "firstName lastName -_id" }).populate({ path: "courseId", populate: { path: "directorId", select: "firstName lastName -_id" } });
        let reportsCnt = await Report.find({ courseId: { $in: courses } }).populate({ path: "teacherId", select: "firstName lastName -_id" }).populate({ path: "courseId", populate: { path: "directorId", select: "firstName lastName -_id" } }).count();
        let reportsx = {
            repFilter: reports.filter(item => { return item.date && getDateXDaysAgo(1, item.date).getFullYear() == year && getDateXDaysAgo(1, item.date).getMonth() == month - 1 }), rep: reports, reportsCnt
        };
        console.log(reports)
        return res.send(reportsx.repFilter);
    }

    //    let prev = new Date(year, month, 0);
    //     let next = new Date(year, month+1,0 );
    //         console.log(prev)
    //         console.log(next)

    // try {
    //     const reports = await Report.find({ date: { $gt: prev, $lt: next } }).populate({ path: "teacherId", select: "firstName lastName -_id" }).populate({ path: "courseId", populate: { path: "directorId", select: "firstName lastName -_id" } });
    //     console.log(reports)
    //     return res.send(reports);
    // }

    // try {
    //     const reports = await Report.find({ 
    //         "$expr": { 
    //             "$and": [ 
    //                 { "$eq": [ { "$month": "$date" }, month ] },
    //                 { "$eq": [ { "$year": "$date" }, year ] }
    //             ] 

    //         } 
    //     }).populate({ path: "teacherId", select: "firstName lastName -_id" }).populate({ path: "courseId", populate: { path: "directorId", select: "firstName lastName -_id" } });
    //     console.log(reports)
    //     return res.send(reports);
    // }
    catch (e) {
        return res.status(400).send(e.message);

    }
}
function getDateXDaysAgo(numOfDays, date = new Date()) {
    const daysAgo = new Date(date.getTime());

    daysAgo.setDate(date.getDate() - numOfDays);

    return daysAgo;
}

const getAllReportsByTeacherIdMonthAndYear = async (req, res) => {
    let { year, month, teacherId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(teacherId))
        return res.status(400).send("id not valid");
    const teacher = await User.findById(teacherId);
    if (!teacher)
        return res.status(400).send("no such teacher");
    let first = new Date(year, month - 1);
    let last = new Date(year, month);
    try {
        const reports = await Report.find({ teacherId, date: { $gte: first, $lt: last } });
        return res.send(reports);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }
}
const getAllReportsByTeacherIdAndYear = async (req, res) => {
    let { year, teacherId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(teacherId))
        return res.status(400).send("id not valid");
    const teacher = await User.findById(teacherId);
    if (!teacher)
        return res.status(400).send("no such teacher");
    let first = new Date(year, 0);
    let last = new Date(year + 1, 0);
    try {
        const reports = await Report.find({ teacherId, date: { $gte: first, $lt: last } });
        return res.send(reports);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }
}
const getAllReportsByTeacherId = async (req, res) => {
    console.log("place")
    let { teacherId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(teacherId))
        return res.status(400).send("id not valid");
    try {
        const teacher = await User.findById(teacherId);

        console.log("place", teacher)


        if (!teacher)
            return res.status(400).send("no such teacher");

        const reports = await Report.find({ teacherId }).populate("courseId");
        return res.send(reports);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }
}
const addReport = async (req, res) => {

    let { teacherId, date, fromTime, toTime, numHours, subject, courseId, type, comment } = req.body;
    if (!mongoose.Types.ObjectId.isValid(teacherId))
        return res.status(400).send("teacher id is not valid");
    try {
        const teacher = await User.findById(teacherId);
        console.log(teacher)
        if (!teacher)
            return res.status(400).send("no such teacher");

        const course = await Course.findById(courseId);
        console.log(course)
        if (!course)
            return res.status(400).send("no such course");
        let report = new Report({ teacherId, date, fromTime, courseId, toTime, numHours, subject, courseId, type, comment });

        await report.save();
        return res.send(report);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }
}
const addReports = async (req, res) => {

    let reports = req.body;
    console.log(reports)
    try {
        //todo: לשפר לולאה שתעבוד אסינכורני בן האלמנטים ורק הסוף יהיה סינכורני
        for (const element of reports) {
            let { courseId, teacherId } = element;
            if (!mongoose.Types.ObjectId.isValid(courseId))
                return res.status(400).send("course id is not valid");
            const course = await Course.findById(courseId);
            if (!course)
                return res.status(404).send("no such course");
            if (!mongoose.Types.ObjectId.isValid(teacherId))
                return res.status(400).send("teacher id is not valid");
            const teacher = await User.findById(teacherId);
            if (!teacher)
                return res.status(404).send("no such teacher");
        }
        let rep = reports.map(item => {
            return {
                teacherId: item.teacherId
                , date: item.date,
                // fromTime: convertToTime(item.fromTime),

                fromTime: item.fromTime,
                courseId: item.courseId,
                // toTime: convertToTime(item.toTime),
                toTime: item.toTime,
                numHours: item.numHours,
                subject: item.subject,
                courseId: item.courseId,
                type: item.type,
                comment: item.comment


            }
        })

        await Report.insertMany(rep);
        return res.send(rep);
    }
    catch (e) {
        return res.status(400).send(e.message);
    }
}

const saveReportChanges = async (req, res) => {
    const cnt = { deleted: 0, added: 0, updated: 0 };
    let reports = req.body;
    console.log(reports)
    let changes = groupBy(reports, "modelState")
    try {
        //todo: לשפר לולאה שתעבוד אסינכורני בן האלמנטים ורק הסוף יהיה סינכורני
        if (changes.added) {
            for (const element of changes.added) {
                cnt.added++;
                let { courseId, teacherId } = element;
                if (!mongoose.Types.ObjectId.isValid(courseId))
                    return res.status(400).send("course id is not valid");
                const course = await Course.findById(courseId);
                if (!course)
                    return res.status(404).send("no such course");
                if (!mongoose.Types.ObjectId.isValid(teacherId))
                    return res.status(400).send("teacher id is not valid");
                const teacher = await User.findById(teacherId);
                if (!teacher)
                    return res.status(404).send("no such teacher");
            }
            let rep = changes.added.map(item => {
                //  let date = new Date(item.date)
                return {
                    ...item,
                    // date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
                    fromTime: item.fromTime,
                    toTime: item.toTime
                    //  fromTime: convertToTime(item.fromTime),
                    // toTime: convertToTime(item.toTime)
                }
            })

            await Report.insertMany(rep);


        }
        //עריכה
        if (changes.updated) {
            for (const element of changes.updated) {
                cnt.updated++;
                let { courseId, teacherId, _id } = element;
                if (!mongoose.Types.ObjectId.isValid(courseId))
                    return res.status(400).send("course id is not valid");
                if (!mongoose.Types.ObjectId.isValid(_id))
                    return res.status(400).send("מזהה דווח לא תקין");
                const course = await Course.findById(courseId);
                if (!course)
                    return res.status(404).send("no such course");
                if (!mongoose.Types.ObjectId.isValid(teacherId))
                    return res.status(400).send("teacher id is not valid");
                const teacher = await User.findById(teacherId);
                if (!teacher)
                    return res.status(404).send("no such teacher");
                await Report.findByIdAndUpdate(_id, element)
            }

            //   let rep = changes.updated.map(item => {
            //  let date = new Date(item.date)
            //   return {
            //  ...item,
            // date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            //  fromTime: item.fromTime,
            // toTime: item.toTime
            //  fromTime: convertToTime(item.fromTime),
            // toTime: convertToTime(item.toTime)

        }

        //   await Report.insertMany(rep);



        if (changes.deleted)
            for (const element of changes.deleted) {

                if (!mongoose.isValidObjectId(element.id))
                    return res.status(400).send("not a valid _id");
                await Report.findByIdAndDelete(element.id)
                cnt.deleted++;
            }
        return res.send(cnt);
    }
    catch (e) {
        return res.status(400).send(e.message);
    }
}
function groupBy(arr, property) {
    return arr.reduce(function (memo, x) {
        if (!memo[x[property]]) { memo[x[property]] = []; }
        memo[x[property]].push(x);
        return memo;
    }, {});
}
// const convertToTime = (time) => {
//     let d = new Date("1-1-1900 " + time);
//     d.setMonth(new Date().getMonth());
//     d.setFullYear(new Date().getFullYear());
//     d.setDate(new Date().getDate())
//     return d;
// }
module.exports = {
    getAllReports,
    getAllReportsByTeacherId,
    getAllReportsByTeacherIdAndYear,
    getAllReportsByTeacherIdMonthAndYear,
    getAllReportsByYearAndMonth,
    addReport,
    addReports,
    saveReportChanges,
    getAllReportsByDirectorIdYearAndMonth,
    searchByParameters
}