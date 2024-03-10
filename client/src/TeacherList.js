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



const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

export default function TeacherList() {
    const deleteTeacher = (item) => {
        let confir = window.confirm("האם ברצונך למחוק מורה " + item.firstName + " " + item.lastName)
        let id = item._id
        if (confir)
            axios.delete(BASE_URL + "users/" + id).then(res => {
                console.log(res.data);
                setTeachers(teachers.filter(item => item._id !== id));
            }).
                catch(err => {
                    console.log(err);
                    alert("תקלה במחיקת מורה")
                })
    }
    const [teachers, setTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTeacherList, setFilteredTeacherList] = useState([]);
    const [editTeacherDialogVisible, setEditTeacherDialogVisible] = useState(null)
    useEffect(() => {
        let tempFilteredArrTeachers = teachers.filter(item => {
            if ((item.firstName + " " + item.lastName).indexOf(searchTerm) > -1 || item.firstName.indexOf(searchTerm) > -1 || item.lastName.indexOf(searchTerm) > -1 || item.tz.indexOf(searchTerm) > -1 || item.email && item.email.indexOf(searchTerm) > -1)
                return true;
            return false;
        });
        setFilteredTeacherList(tempFilteredArrTeachers);
    }, [teachers, searchTerm])
    const saveUpdateChanges = (updated) => {
        setTeachers(teachers.map(teacher => {
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
    const deleteTeacherFromCourse = (teacherId, courseId) => {
        // let res = teachers.map(item => {
        //     if (item._id == teacherId)
        //         return { ...item, courses: item.courses.filter(x => x._id !== courseId) }
        //     return item;
        // })
        // setTeachers(res)
    }
    useEffect(() => {
        
        axios.get(BASE_URL + "users/teachers").
            then(res => {
                console.log(res.data);
                let t = res.data;
                axios.get(BASE_URL + "teacherCourses").
                    then(resp => {
                        console.log(resp.data);

                        t = t.map(item => { return { ...item, courses: resp.data.filter(a => a.teacherId && a.teacherId._id == item._id).map(x => x.courseId) } });
                        setTeachers(t)
                        console.log(t)
                    }).
                    catch(err => {
                        console.log(err);
                        alert("תקלה בהצגת קורסים בהם מלמדות המורות")
                        setTeachers(t);
                    })

            }).
            catch(err => {
                console.log(err);
                alert("תקלה בהצגת המורות")
            })



    }, []);
    const [dense, setDense] = useState(false);
    // const [secondary, setSecondary] = React.useState(false);

    return (<div >
        <Box sx={{ flexGrow: 1 }}>
        <TextField 
    sx={{float:"left" ,m:1}}
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
                מורות
            </Typography>
            <Demo>
                <List dense={dense} dir="ltr">
                    {filteredTeacherList.map(item => {
                        return <TeacherListItem deleteTeacherFromCourse={deleteTeacherFromCourse} key={item._id} editTeacher={() => { setEditTeacherDialogVisible(item) }} deleteTeacher={deleteTeacher} item={item} />
                    })}
                </List>
            </Demo>

        </Box>
        <EditTeacherDialog teacher={editTeacherDialogVisible} saveChanges={saveUpdateChanges} handleClose={() => { setEditTeacherDialogVisible(null) }} />
    </div>

    );
}