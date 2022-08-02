import { Box, Button, FormControlLabel, Switch, FormGroup } from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { saveCurrentStatus } from "./store/actions/setting";
import { getCurrentViewMonthAndYear, isDateBeforeCurrentViewYearAndMonth } from "./Utils";
import { BASE_URL } from "./VARIABLES";
const Setting = () => {
    let isOpen = useSelector(st => st.setting.isOpen)
    let currentUser = useSelector(st => st.index.currentUser)
    let lastClosedMonth = useSelector(st => st.setting.lastClosedMonth)
    let lastClosedYear = useSelector(st => st.setting.lastClosedYear)
    let dispatch = useDispatch();
    let currentViewDate = getCurrentViewMonthAndYear();
    const closeMonth = () => {
        if (currentUser) {
            axios.post(`${BASE_URL}setting`, {
                monthToBeChanged: currentViewDate.month,
                yearToBeChanged: currentViewDate.year,
                changeType: "month",
                userId: currentUser._id
            })
            .then(res => {
                alert("ההגדרות נשמרו בהצלחה")
                dispatch(saveCurrentStatus(res.data));
            }).
                catch(err => {
                    console.log(err);
                    alert("תקלה בשמירת ההגדרות ")
                })
        }
    }

    const changeAllStatus = () => {
        if (currentUser) {
            axios.post(`${BASE_URL}setting`, {

                changeType: "all",
                userId: currentUser._id
            })
            .then(res => {
                alert("ההגדרות נשמרו בהצלחה")
                dispatch(saveCurrentStatus(res.data));
            }).
                catch(err => {
                    console.log(err);
                    alert("תקלה בשמירת ההגדרות ")
                })
        }
    }
    return <>
        <Box>
            <FormGroup>
                <FormControlLabel control={<Switch checked={isOpen} onChange={changeAllStatus} />} label={isOpen ? "המערכת פתוחה לדווחים" : "המערכת סגורה לדווחים"} />
                {/* <FormControlLabel disabled={isOpen} control={<Switch />} label="חודש " /> */}
                <Button onClick={closeMonth} disabled={isOpen || !isDateBeforeCurrentViewYearAndMonth(new Date(lastClosedYear, lastClosedMonth))} value={`סגור חודש ${currentViewDate.month} - ${currentViewDate.year}`} />
            </FormGroup>
        </Box>
    </>
}
export default Setting;