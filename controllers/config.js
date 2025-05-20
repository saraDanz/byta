const mongoose = require("mongoose");
const Config = require("../models/config").configModel;
const User = require("../models/user").userModel;


const getConfigsByYear = async (req, res) => {
    try {
        const { year } = req.params;
        let configs = await Config.find({ year }).populate("userId", "firstName lastName").sort({ "year": 1, "month": -1 });
        let tilMonth = 12;
        let now = new Date();
        if (year == now.getFullYear())
            tilMonth = now.getMonth();
        let arr = new Array(tilMonth).fill(false);
        let newConfigs = [];
        configs.forEach(element => {
            arr[element.month] = true;
        });

        arr.forEach((element, index) => {

            if (!element) {
                let newConfig = new Config({
                    year, month: index, isOpen: true
                })
                newConfigs.push(newConfig);
            }
        })
        if (newConfigs.length) {
            await Config.insertMany(newConfigs)
            configs = await Config.find({ year }).populate("userId", "firstName lastName").sort({ "year": 1, "month": -1 });

        }

        return res.send(configs);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }
}

const addNewconfig = async (req, res) => {
    try {
        let { year, month,
            isOpen,
            userId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId))
            return res.status(400).send("user id is not valid");
        let user = await User.findById(userId);
        console.log(user)
        if (!user)
            return res.status(404).send("no such user");
        if (user.role != 3)
            return res.status(400).send("user is not allowed to set config");
        let config = await Config.find({ year, month });
        if (config) {

            if (config.isOpen == isOpen)
                return res.status(409).send("nothing to update");
            config = await Config.findOneAndUpdate({ year, month }, { isOpen })
            // await config.save();
            let configs = await Config.find({ year }).populate("userId", "firstName lastName").sort({ "year": 1, "month": -1 });

            return res.send(configs);

        }

        else {



            let now = new Date();
            if (year > now.getFullYear() || year == now.getFullYear() && month > now.getMonth())
                return res.status(400).send("cannot set future month ");
            let newconfig = new config({
                year,
                month,
                "isOpen": isOpen,
                "userId": userId
            })

            await newconfig.save();
            return res.send(newconfig)
        }
    }

    catch (e) {
        return res.status(400).send(e.message);


    }
}



// const getLastMonthChangeHelper = async () => {
//     const config = await config.find({ changeType: "month" }).sort({ yearToBeChanged: -1, monthToBeChanged: -1 }).limit(1);
//     return config.length ? config[0] : null;
// }
// const getLastAllStatusChangeHelper = async () => {
//     const config = await config.find({ changeType: "all" }).sort({ setDate: -1 }).limit(1);
//     return config.length ? config[0] : null;
// }


module.exports = {

    addNewconfig, getConfigsByYear
}