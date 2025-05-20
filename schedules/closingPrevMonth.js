const Config = require("../models/config").configModel;
const closingPrevMonthEveryDateInMonth = async () => {
    try {

        let currentDate = new Date();
        let year = currentDate.getFullYear(), month = currentDate.getMonth()-1;

        let config = await Config.find({ year, month });
        if (config) {

            if (config.isOpen == false)
                console.log("nothing to update");
            config = await Config.findOneAndUpdate({ year, month }, { isOpen: false })

        }
    } catch (err) {

        console.log(err)
        console.log("תקלה בנסיון לסגור את החודש הקודם לדיווחים")
    }
}
module.exports = closingPrevMonthEveryDateInMonth;