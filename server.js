const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


const userRoute = require("./routes/user");
const reportRoute = require("./routes/report");
const coursesRoute = require("./routes/courses");
const teacherCoursesRoute = require("./routes/teacherCourses");
const path = require("path")

// ... other app.use middleware 

// ...
// Right before your app.listen(), add this:

require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "client", "build")))

mongoose.connect(process.env.DB||"mongodb+srv://sara:6PsUABpopt63jWxY@byta-reporst.hj4vu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true }).then(() => { console.log("mongo db connected") })
    .catch(err => { console.log(err) })

app.use("/users", userRoute)
app.use("/reports", reportRoute)
app.use("/courses", coursesRoute)
app.use("/teacherCourses", teacherCoursesRoute)
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static('client/build')); // serve the static react app
//     app.get(/^\/(?!api).*/, (req, res) => { // don't serve api routes to react app
//       res.sendFile(path.join(__dirname, './client/build/index.html'));
//     });
//     console.log('Serving React App...');
//   };
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
app.listen(process.env.PORT || 8000, () => { console.log("waiting port 8000") })
//userName sara
//6PsUABpopt63jWxY