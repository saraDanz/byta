import { Box, CircularProgress, Button, FormControlLabel, Paper, Switch, FormGroup, Typography } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from 'react';
import { saveConfigs } from './store/actions/config';
import { useDispatch, useSelector } from "react-redux";
import { saveCurrentStatus } from "./store/actions/setting";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Slide from '@mui/material/Slide';
import { getCurrentViewMonthAndYear, isDateBeforeCurrentViewYearAndMonth } from "./Utils";
import { BASE_URL } from "./VARIABLES";
const Setting = () => {
    // let isOpen = useSelector(st => st.setting.isOpen)
    let currentUser = useSelector(st => st.index.currentUser)
    let configs = useSelector(st => st.config.configs)
    // let lastClosedMonth = useSelector(st => st.setting.lastClosedMonth)
    // let lastClosedYear = useSelector(st => st.setting.lastClosedYear)
    let dispatch = useDispatch();
    const [minYearToShow, setMinYearToShow] = useState(new Date().getFullYear());
    const [showAlert, setShowAlert] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    // let cu rrentViewDate = getCurrentViewMonthAndYear();
    useEffect(() => {
        let d = new Date()
        if (configs && !configs[d.getFullYear()]) {
            setShowSpinner(true)
            axios.get(`${BASE_URL}configs/byYear/${new Date().getFullYear()}`).then(res => {
                dispatch(saveConfigs(new Date().getFullYear(), res.data))

            }).
                catch(err => {
                    console.log(err);
                    alert("תקלה בקליטת ההגדרות")
                }).finally(() => { setShowSpinner(false) })
        }

    }, [configs]);

    const closeMonth = (year, month, isOpen) => {
        if (currentUser) {
            axios.post(`${BASE_URL}configs`, {
                month: month,
                year: year,
                isOpen: isOpen,
                userId: currentUser._id
            })
                .then(res => {
                    //  alert("ההגדרות נשמרו בהצלחה")
                    setShowAlert(true);
                    setTimeout(() => {
                        setShowAlert(false);

                    }, 2000);
                    dispatch(saveConfigs(year, res.data));
                }).
                catch(err => {
                    console.log(err);
                    alert("תקלה בשמירת ההגדרות ")
                })
        }
    }
    const getMore = () => {
        let min = minYearToShow - 1;
        if (configs && !configs[min]) {
            setShowSpinner(true)
            axios.get(`${BASE_URL}configs/byYear/${min}`).then(res => {
                dispatch(saveConfigs(min, res.data))

            }).
                catch(err => {
                    console.log(err);
                    alert("תקלה בקליטת ההגדרות")
                }).finally(() => { setShowSpinner(false) })
        }
        setMinYearToShow(minYearToShow - 1)
    }
    // const changeAllStatus = (e) => {
    //     if (currentUser) {
    //         axios.post(`${BASE_URL}settings`, {

    //             changeType: "all",
    //             userId: currentUser._id,
    //             isOpen: e.target.checked
    //         })
    //             .then(res => {
    //                 alert("ההגדרות נשמרו בהצלחה")
    //                 dispatch(saveCurrentStatus(res.data));
    //             }).
    //             catch(err => {
    //                 console.log(err);
    //                 alert("תקלה בשמירת ההגדרות ")
    //             })
    //     }
    // }
    let d = new Date().getFullYear();

    let configsToShow = []
    // Object.keys(configs).filter(item => item >= minYearToShow).map((item, index) => configsToShow = [...configsToShow, ...item]);
    // Object.keys(configs).filter(item => item >= minYearToShow).sort().forEach((item, index) => configsToShow = [...configsToShow, ...configs[item]]);
    Array.from({ length: d - minYearToShow + 1 }, (v, k) => k + minYearToShow).sort((a, b) => b - a).forEach((item, index) => { if (configs[item]) configsToShow = [...configsToShow, ...configs[item]] });
    return <>


        <Paper sx={{ width: "60ch", margin: "auto", mt: 7, padding: "20px" }}>
            <Box sx={{ "alignItem": "center", justifyContent: "center" }}>
                <Slide direction="down" in={showAlert} mountOnEnter unmountOnExit>
                    <Alert severity="success">
                        <AlertTitle>ההגדות נשמרו בהצלחה</AlertTitle>
                        {/*<strong>check it out!</strong>*/}
                    </Alert>
                </Slide>
                <Typography variant="h5" sx={{ "textAlign": "center" }}>הגדרות מערכת</Typography>
           
                {!configsToShow.length ? <CircularProgress /> : configsToShow.map(item => {
                    return <FormGroup key={item.year + "/" + item.month}>
                        <FormControlLabel control={<Switch checked={item.isOpen} />} onChange={(e) => closeMonth(item.year, item.month, e.target.checked)} label={`${(item.month + 1)}/${item.year}`} />
                    </FormGroup>
                })}

                {!showSpinner && <Button onClick={getMore} >הצג עוד </Button>}

                {/*  <FormGroup>

                    <FormControlLabel disabled={isOpen} control={<Switch />} label="חודש " /> 
                    <Button onClick={closeMonth} disabled={isOpen || !isDateBeforeCurrentViewYearAndMonth(new Date(lastClosedYear, lastClosedMonth))} >{`סגור חודש ${currentViewDate.month} - ${currentViewDate.year}`} </Button>
                </FormGroup>*/}

            </Box>
        </Paper>

    </>
}
export default Setting;