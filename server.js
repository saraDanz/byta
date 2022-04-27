const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


const userRoute = require("./routes/user");
const reportRoute = require("./routes/report");
const coursesRoute = require("./routes/courses");
const teacherCoursesRoute = require("./routes/teacherCourses");
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://sara:6PsUABpopt63jWxY@byta-reporst.hj4vu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority").then(() => { console.log("mongo db connected") })
    .catch(err => { console.log(err) })

app.use("/users", userRoute)
app.use("/reports", reportRoute)
app.use("/courses", coursesRoute)
app.use("/teacherCourses", teacherCoursesRoute)
app.listen(3500, () => { console.log("waiting port 3500") })
//userName sara
//6PsUABpopt63jWxY