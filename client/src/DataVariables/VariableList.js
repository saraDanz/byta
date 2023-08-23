import { useState, useTransition, useMemo, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, TextField } from "@mui/material";

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import "./VariableList.css";
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import LinearProgress from '@mui/material/LinearProgress';
// import Box from '@mui/material/Box';
// import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { BASE_URL } from '../VARIABLES';
import axios from 'axios';
import VariableListItem from './VariableListItem';
import AddEditVariableDialog from "./AddEditVariableDialog";
import EditIcon from '@mui/icons-material/Edit';



const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

export default function VariableList() {
    // const deleteTeacher = (item) => {
    //     let confir = window.confirm("האם ברצונך למחוק מורה " + item.firstName + " " + item.lastName)
    //     let id = item._id
    //     if (confir)
    //         axios.delete(BASE_URL + "users/" + id).then(res => {
    //             console.log(res.data);
    //             setTeachers(teachers.filter(item => item._id !== id));
    //         }).
    //             catch(err => {
    //                 console.log(err);
    //                 alert("תקלה במחיקת מורה")
    //             })
    // }
    const [variables, setVariables] = useState([]);
    const [selectedVariable, setSelectedVariable] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    // const [filteredTeacherList, setFilteredTeacherList] = useState([]);
    const [isPending, startTransition] = useTransition();

    const [variableDialogStatus, setVariableDialogStatus] = useState(0)
    const handleEdit = () => {
        setSelectedVariable(null);
    }
    const handleSave = (newItem) => {
        setVariables([newItem, ...variables])
    }
    // const saveUpdateChanges = (updated) => {
    //     setTeachers(teachers.map(teacher => {
    //         if (teacher._id != updated._id)
    //             return teacher;
    //         return updated;
    //     }).sort(
    //         function (a, b) {
    //             if (a.lastName === b.lastName) {
    //                 // Price is only important when cities are the same
    //                 return a.firstName > b.firstName ? 1 : -1;
    //             }
    //             return a.lastName > b.lastName ? 1 : -1;
    //         }));

    // }


    useEffect(() => {
        setIsLoading(true)
        axios.get(BASE_URL + "variables").
            then(res => {
                console.log(res.data);
                let t = res.data;





                setVariables(t)
                console.log(t)
            }).

            catch(err => {
                console.log(err);
                alert("תקלה בהצגת נתוני המערכת")
            }).finally(() => { setIsLoading(false) })



    }, []);

    let filteredVariableList = useMemo(() => {
        return variables.filter(item => {
            if (item.name ?.indexOf(searchTerm) > -1 || item.key ?.indexOf(searchTerm) > -1 )
                return true;
            return false;
        })
    }, [searchTerm, variables]);

    return (<div >
        <Box sx={{ flexGrow: 1 }}>
            <TextField
                sx={{ float: "left", m: 1 }}
                id="input-with-icon-textfield"
                label=""
                onChange={(e) => {
                    startTransition(() => {
                        setSearchTerm(e.target.value)
                    })

                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                variant="outlined"
            />
            <Button variant="contained" onClick={() => { setVariableDialogStatus(1) }}>הוסף נתון</Button>






            <Typography sx={{ mt: 4, mb: 2 }} variant="h5" component="div">
                נתוני מערכת
            </Typography>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h5" component="div">
                ראשית מוצגים הנתונים העדכניים ביותר
       </Typography>
            {isLoading && <Box sx={{ display: "block", width: '100%' }}><LinearProgress /></Box>}
            <Demo>
                <List dense={false} dir="ltr">
                    {filteredVariableList.map(item => {
                        return <VariableListItem key={item._id} editVariable={() => { setVariableDialogStatus(2); setSelectedVariable(item) }} item={item} />
                    })}
                </List>
            </Demo>

        </Box>

        {variableDialogStatus && <AddEditVariableDialog
            status={variableDialogStatus}
            variable={selectedVariable}
            onSave={handleSave}
            onEdit={handleEdit}
            handleClose={() => { setVariableDialogStatus(0) }} />}
    </div>

    );
}