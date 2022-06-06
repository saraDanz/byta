import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
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
    const [courses, setCourses] = useState([]);
    useEffect(() => {
        axios.get(BASE_URL + "courses").
            then(res => {
                console.log(res.data);
                setCourses(res.data);
            }).
            catch(err => {
                console.log(err);
                alert("תקלה בהצגת הקורסים")
            })
    }, []);
    const [dense, setDense] = useState(false);
    // const [secondary, setSecondary] = React.useState(false);

    return (<div >

        <Box sx={{ flexGrow: 1 }}>




            <Typography sx={{ mt: 4, mb: 2 }} variant="h5" component="div">
                קורסים
          </Typography>
            <Demo>
                <List dense={dense} dir="ltr">
                    {courses.map(item => {
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
                                primary={item.directorId.firstName+" "+item.directorId.lastName}
                                secondary={"רכזת"}
                            />
                        </ListItem>
                    })}
                </List>
            </Demo>

        </Box>
    </div>
    );
}