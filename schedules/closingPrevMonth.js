const schedule = require('node-schedule');

const Config = require("../models/config").configModel;
const Variable = require("../models/variable").variableModel;
const closingPrevMonthEveryDateInMonth = async () => {
    try {

        let currentDate = new Date();
        let year = currentDate.getFullYear(), month = currentDate.getMonth() - 1;
        console.log(year, month,"זה החודש והשנה שהולכים עכשיו להסגר");
        if (month == -1) { month = 11, year--; }
        //כאן לבדוק האם החודש הראשון בשנה סוגר את החודש משנה קודמת

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

// עדכון פעולה שנרצה להריץ ביום הזה
async function runMonthlyClosing() {
    closingPrevMonthEveryDateInMonth()
}

const getLastVariableByFieldName = async (name, key) => {
    try {

        if (!name || !key)
            return;

        let variables = await Variable.find({ name, key }).sort({ "setDate": -1 });

        if (!variables.length)
            return;
        return variables[0];
    }
    catch (e) {
        console.log(e)
        console.log("שגיאה בהבאת היום בחודש לסגיר מערכת")

    }
}


// תזמון ריצה ליום הנבחר בחודש הקרוב
async function scheduleNextMonthlyJob() {
    console.log("ץזמון חודש עובד ",new Date())
    const dateToclose = await getLastVariableByFieldName("dateInMonthToAutoCloseReportSystem", "dayOfMonth");
    console.log(dateToclose)
    const dayOfMonth = dateToclose.value;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // הרץ בתאריך הקרוב הבא
    let nextRunDate = new Date(currentYear, currentMonth, dayOfMonth, 0, 0, 0);

    // אם היום כבר עבר – עבור לחודש הבא
    if (nextRunDate < now) {
        nextRunDate = new Date(currentYear, currentMonth + 1, dayOfMonth, 0, 0, 0);
    }

    console.log("nextRunDate",nextRunDate)
    schedule.scheduleJob(nextRunDate, async () => {
        await runMonthlyClosing();

        // ⚠️ תזמן מחדש לחודש הבא
        scheduleNextMonthlyJob();
    });

    console.log("🎯 תוזמנה סגירה לתאריך: ", nextRunDate);
}
module.exports = { closingPrevMonthEveryDateInMonth, scheduleNextMonthlyJob };