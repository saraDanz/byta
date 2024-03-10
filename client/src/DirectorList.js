import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, TextField } from "@mui/material";

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import "./TeacherList.css";
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
// import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { BASE_URL } from './VARIABLES';
import axios from 'axios';
import TeacherListItem from './TeacherListItem';
import EditTeacherDialog from "./EditTeacherDialog";
import EditIcon from '@mui/icons-material/Edit';
import  DirectorListItem  from "./DirectorListItem";


const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

export default function DirectorList() {
    const deleteTeacher = (item) => {
        let confir = window.confirm("האם ברצונך למחוק מורה  " + item.firstName + " " + item.lastName)
        let id = item._id
        if (confir)
            axios.delete(BASE_URL + "users/" + id).then(res => {
                console.log(res.data);
                setDirectors(directors.filter(item => item._id !== id));
            }).
                catch(err => {
                    console.log(err);
                    alert("תקלה במחיקת מורה")
                })
    }
    const [directors, setDirectors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredDirectorsList, setFilteredDirectorsList] = useState([]);
    const [editDirectorDialogVisible, setEditDirectorDialogVisible] = useState(null)
    useEffect(() => {
        let tempFilteredArrDirectors = directors.filter(item => {
            if ((item.firstName + " " + item.lastName).indexOf(searchTerm) > -1 || item.firstName.indexOf(searchTerm) > -1 || item.lastName.indexOf(searchTerm) > -1 || item.tz.indexOf(searchTerm) > -1 || item.email && item.email.indexOf(searchTerm) > -1)
                return true;
            return false;
        });
        setFilteredDirectorsList(tempFilteredArrDirectors);
    }, [directors, searchTerm])
    const saveUpdateChanges = (updated) => {
        setDirectors(directors.map(teacher => {
            if (teacher._id != updated._id)
                return teacher;
            return updated;
        }).sort(
            function(a, b) {          
               if (a.lastName === b.lastName) {
                  // Price is only important when cities are the same
                  return a.firstName > b.firstName ? 1 : -1;
               }
               return a.lastName > b.lastName ? 1 : -1;
            }));

    }
    // const deleteTeacherFromCourse = (teacherId, courseId) => {
    //     // let res = teachers.map(item => {
    //     //     if (item._id == teacherId)
    //     //         return { ...item, courses: item.courses.filter(x => x._id !== courseId) }
    //     //     return item;
    //     // })
    //     // setTeachers(res)
    // }
    useEffect(() => {

        axios.get(BASE_URL + "users/directorsAndCourses").
            then(res => {
                console.log(res.data);
                let t = res.data;
                setDirectors(res.data)
            }).
            catch(err => {
                console.log(err);
                alert("תקלה בהצגת הרכזות")
            })
    }, []);

    return (<div >
        <Box sx={{ flexGrow: 1 }}>
            <TextField
                sx={{ float: "left", m: 1 }}
                id="input-with-icon-textfield"
                label=""
                onChange={(e) => { setSearchTerm(e.target.value) }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                variant="outlined"
            />






            <Typography sx={{ mt: 4, mb: 2 }} variant="h5" component="div">
                רכזות
            </Typography>
            <Demo>
                <List dense={false} dir="ltr">
                    {filteredDirectorsList.map(item => {
                        return <DirectorListItem key={item._id} editTeacher={() => { setEditDirectorDialogVisible(item) }} deleteTeacher={deleteTeacher} item={item} />
                    })}
                </List>
            </Demo>

        </Box>
        <EditTeacherDialog teacher={editDirectorDialogVisible} saveChanges={saveUpdateChanges} handleClose={() => { setEditDirectorDialogVisible(null) }} />
    </div>

    );
}