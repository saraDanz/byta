import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { Button, Paper, Typography } from '@mui/material';
export default function FileChooser({ fields, handleClose, open, handleSave }) {


    const [state, setState] = React.useState(fields.reduce(item => object[item.name] = object.value, {}));

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked,
        });
    };
    return <Grow in={open}>
        <Typography onClick={handleClose}>X</Typography>
        <Paper>
            <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                <FormLabel component="legend">Assign responsibility</FormLabel>
                <FormGroup>
                    {fields.map(item => <FormControlLabel
                        control={
                            <Checkbox checked={state[item.name]} onChange={handleChange} name={item} />
                        }
                        label={item.label}
                    />)}


                </FormGroup>
                <FormHelperText>Be careful</FormHelperText>
            </FormControl>

            <Button variant="outlined" onClick={handleClose}>ביטול</Button>
            <Button variant="outlined" onClick={() => {
                handleSave();
                handleClose();
            }}>אישור</Button>

        </Paper>
    </Grow>
}