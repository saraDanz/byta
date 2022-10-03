import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import SearchIcon from '@mui/icons-material/Search';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import "./TeacherList.css";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EditCourseDialog from "./EditCourseDialog";
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import "./CourseList.css"
    ;
import { useDispatch, useSelector } from 'react-redux';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { InputAdornment, TextField } from "@mui/material";
import { BASE_URL } from './VARIABLES';
import axios from 'axios';

// function generate(element) {
//     return [0, 1, 2].map((value) =>
//         React.cloneElement(element, {
//             key: value,
//         }),
//     );
// }

const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

export default function CourseList() {
    let currentUser = useSelector(st => st.index.currentUser);
    const [courseToEdit, setCourseToEdit] = useState(null);
    const deleteCourse = (item) => {
        let confir = window.confirm("האם ברצונך למחוק קורס " + item.name)
        let id = item._id
        if (confir)
            axios.delete(BASE_URL + "courses/" + id).then(res => {
                console.log(res.data);
                setCourses(courses.filter(item => item._id !== id));
            }).
                catch(err => {
                    console.log(err);
                    alert("תקלה במחיקת קורס")
                })
    }
    const [searchTerm, setSearchTerm] = useState("");
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const openEditCourseDialoge = (item) => {
        setCourseToEdit(item)
    }
    const closeEditCourseDialoge = () => {
        setCourseToEdit(null)
    }
    const saveUpdateChanges = (updated) => {
        setCourses(courses.map(course => {
            if (course._id != updated._id)
                return course;
            return updated;
        }).sort(
            function (a, b) {
                return a.name > b.name ? 1 : -1;

            }));

    }
    useEffect(() => {
        let url = BASE_URL + "courses";
        if (currentUser && currentUser.role == 2)
            url += "byDirectorId/" + currentUser._id;
        axios.get(url).
            then(res => {
                console.log(res.data);
                setCourses(res.data);
            }).
            catch(err => {
                console.log(err);
                alert("תקלה בהצגת הקורסים")
            })
    }, []);
    useEffect(() => {
        let tempFilteredArrCourses = courses.filter(item => {
            if (item.name.indexOf(searchTerm) > -1 || item.symbol && item.symbol.indexOf(searchTerm) > -1 || item.description.indexOf(searchTerm) > -1)
                return true;
            return false;
        });
        setFilteredCourses(tempFilteredArrCourses);
    }, [courses, searchTerm])
    const [dense, setDense] = useState(false);
    // const [secondary, setSecondary] = React.useState(false);

    return (<div id="course-list">
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
                קורסים
          </Typography>
            <Demo>
                <List dense={dense} dir="ltr">
                    {filteredCourses.map(item => {
                        return <ListItem key={item._id}
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={() => { deleteCourse(item) }}>
                                    <DeleteOutlineIcon />
                                </IconButton>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    <FolderIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={item.name}
                                secondary={item.description}

                            />
                            <ListItemText
                                primary={item.symbol}
                                secondary={""}
                            /> <ListItemText
                                primary={item.directorId.firstName + " " + item.directorId.lastName}
                                secondary={"רכזת"}
                            />
                            <IconButton edge="end" onClick={() => { openEditCourseDialoge(item) }}>
                                <EditOutlinedIcon />
                            </IconButton>
                        </ListItem>
                    })}
                </List>
            </Demo>

        </Box>
        <EditCourseDialog handleClose={closeEditCourseDialoge} saveChanges={saveUpdateChanges} course={courseToEdit} />
    </div>
    );
}