import { Box, Button, FormControlLabel, Switch } from "@mui/material";
import { useSelector } from "react-redux"; 
const Setting = () => {
    let isOpen = useSelector(st => st.setting.isOpen)
    let lastClosedMonth = useSelector(st => st.setting.lastClosedMonth)
    return <>
        <Box>
            {/* <FormGroup> */}
                {/* <FormControlLabel control={<Switch checked={isOpen} />} label={isOpen ? "המערכת פתוחה לדווחים" : "המערכת סגורה לדווחים"} /> */}
                {/* <FormControlLabel disabled={isOpen} control={<Switch />} label="חודש " /> */}
                {/* <Button disabled={isOpen||lastClosedMonth==ge} value="סגור חודש {????}" /> */}
            {/* </FormGroup> */}
        </Box>
    </>
}
export default Setting;