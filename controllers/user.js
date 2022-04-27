const mongoose = require("mongoose");
const User = require("../models/user").userModel;

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.send(users);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }
}
const getAllDirectors = async (req, res) => {
    try {
        const users = await User.find({ role: 2 });
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
        if (!user)
            return res.status(404).send("no such user");
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
            email
        } = req.body;

        let user = await User.findOne({ tz });
        if (user)
            return res.status(409).send("user already exists");

        user = new User({
            tz, password, firstName, lastName,
            address,
            phone,
            email,
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
        let { tz, password, firstName, lastName, address, phone, email } = req.body;

        let user = await User.findOne({ tz });
        console.log(user);
        if (user)
            return res.status(409).send("user already exists");

        user = new User({
            tz, password, firstName, lastName,
            address,
            phone,
            email,
            role: 2
        });
        await user.save();
        return res.send(user);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }

}
module.exports = {
    login, addNewTeacher, getAllUsers, addNewDirector, getAllDirectors
}
