const mongoose = require("mongoose");
const Setting = require("../models/setting").settingModel;

const getLastMonthChange = async (req, res) => {
    try {
        const setting = await getLastMonthChangeHelper();
        //שלפתי את ההחודש והשנה האחרונים שיש עליהם עדכון ולא את תאריך שליחת העדכון האחרון
        //כיון שבהמשך יתאפשר להכניס עדכון מתוזמן לעתיד
        console.log(setting);

        return res.send(setting);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }

}
const getLastAllStatusChange = async (req, res) => {
    try {
        const setting = await getLastAllStatusChangeHelper();
        //שלפתי את ההחודש והשנה האחרונים שיש עליהם עדכון ולא את תאריך שליחת העדכון האחרון
        //כיון שבהמשך יתאפשר להכניס עדכון מתוזמן לעתיד
        console.log(setting);

        return res.send(setting);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }

}
const getComputedCurrentStatus = async (req, res) => {

    let allStatus = await getLastAllStatusChangeHelper();
    let monthStatus = await getLastMonthChange();
    return res.send({ allStatus: allStatus.isOpen, lastClosedMonthAndYear: monthStatus })
}
const addNewSetting = async (req, res) => {
    try {
        let { monthToBeChanged,
            yearToBeChanged,
            changeType,
            isOpen,
            userId } = req.body;
        let newSetting;
        if (!mongoose.Types.ObjectId.isValid(userId))
            return res.status(400).send("user id is not valid");
        let user = await User.findById(userId);
        console.log(user)
        if (!user)
            return res.status(404).send("no such user");
        if (!user.role !== 3)
            return res.status(400).send("user is not allowed to set setting");
        if (!monthToBeChanged) {
            let setting = await getLastAllStatusChangeHelper();
            if (setting.isOpen == isOpen)
                return res.status(409).send("nothing to update");
            newSetting = new Setting({


                changeType: "all",
                isOpen,
                userId
            })
        }
        else {
            let setting = await getLastMonthChangeHelper();
            if (setting.yearToBeChanged < yearToBeChanged || setting.monthToBeChanged == monthToBeChanged)
                return res.status(400).send("cannot set past month next month alredy set");

            newSetting = new Setting({
                monthToBeChanged,
                yearToBeChanged,
                changeType: "month",
                isOpen: false,
                userId
            })
        }



        await newSetting.save();
        //return res.send(newSetting);
        let allStatus = await getLastAllStatusChangeHelper();
        let monthStatus = await getLastMonthChange();
        return res.send({ allStatus: allStatus.isOpen, lastClosedMonthAndYear: monthStatus })
    }
    catch (e) {
        return res.status(400).send(e.message);

    }
}
const stam=async (req,res)=>{
    try{
        
    newSetting = new Setting({
        monthToBeChanged:6,
        yearToBeChanged:2022,
        changeType: "month",
        isOpen: false,
        userId
    })
}



await newSetting.save();
//return res.send(newSetting);
}

catch (e) {
return res.status(400).send(e.message);

}
}
const getLastMonthChangeHelper = async () => {
    const setting = await Setting.find({ changeType: "month" }).sort({ yearToBeChanged: -1, monthToBeChanged: -1 }).limit(1);
    return setting;
}
const getLastAllStatusChangeHelper = async () => {
    const setting = await Setting.find({ changeType: "all" }).sort({ setDate: -1 }).limit(1);
    return setting;
}


module.exports = { getLastAllStatusChange, getLastMonthChange, addNewSetting, getComputedCurrentStatus }