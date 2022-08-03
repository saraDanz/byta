import { Box, CircularProgress, Button, FormControlLabel, Paper, Switch, FormGroup, Typography } from "@mui/material";
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
            axios.post(`${BASE_URL}settings`, {
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

    const changeAllStatus = (e) => {
        if (currentUser) {
            axios.post(`${BASE_URL}settings`, {

                changeType: "all",
                userId: currentUser._id,
                isOpen: e.target.checked
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
        <Paper sx={{ width: "60ch", margin: "auto", mt: 7, padding: "20px" }}>
            <Box sx={{ "alignItem": "center", justifyContent: "center" }}>
                <Typography variant="h5" sx={{ "textAlign": "center" }}>הגדרות מערכת</Typography>
                <FormGroup>
                    {isOpen != null ? <FormControlLabel control={<Switch checked={isOpen} onChange={changeAllStatus} />} label={isOpen ? "המערכת פתוחה לדווחים" : "המערכת סגורה לדווחים"} /> : <CircularProgress />}
                </FormGroup> <FormGroup>

                    {/* <FormControlLabel disabled={isOpen} control={<Switch />} label="חודש " /> */}
                    <Button onClick={closeMonth} disabled={isOpen || !isDateBeforeCurrentViewYearAndMonth(new Date(lastClosedYear, lastClosedMonth))} >{`סגור חודש ${currentViewDate.month} - ${currentViewDate.year}`} </Button>
                </FormGroup>
            </Box>
        </Paper>
    </>
}
export default Setting;