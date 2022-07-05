
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import FolderIcon from '@mui/icons-material/Folder';
import ListItemText from '@mui/material/ListItemText';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ListItemButton from '@mui/material/ListItemButton';
import axios from "axios";
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
// import IconButton from '@mui/material/IconButton';
import { useState } from "react"
import Tooltip from '@mui/material/Tooltip';
import ArrowRight from '@mui/icons-material/ArrowRight';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import People from '@mui/icons-material/People';
import PermMedia from '@mui/icons-material/PermMedia';
import Dns from '@mui/icons-material/Dns';
import Public from '@mui/icons-material/Public';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { BASE_URL } from './VARIABLES';
// import {DeleteIcon }from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
export default function TeacherListItem({ item, deleteTeacher, editTeacher, deleteTeacherFromCourse }) {
    const [open, setOpen] = useState(false);
    const deleteCourse = (course) => {
        if (window.confirm("האם המורה אינה מלמדת בקורס " + course.name)) {
            try {


                axios.delete(BASE_URL + `users/${item._id}/${course._id}`)
                    .then(res => {
                        deleteTeacherFromCourse(item._id, course._id)
                    })
                    .catch(err => {
                        console.log(err)
                        alert("שגיאה בהסרת המורה מהקורס")
                    })
            } catch (e) {
                console.log(e)
                alert("שגיאה בהסרת המורה מהקורס")
            }
        }
    }
    return <> <ListItem key={item._id}
        secondaryAction={
            <>   <IconButton edge="end" aria-label="delete" onClick={() => { deleteTeacher(item) }}>
                <DeleteOutlineIcon />
            </IconButton>

            </>
        }
    >

        <ListItemAvatar>
            <Avatar>
                <PersonOutlineIcon /></Avatar>
        </ListItemAvatar>
        <ListItemText
            primary={item.firstName + " " + item.lastName}
            secondary={item.tz}

        />
        <ListItemText
            primary={item.email}
            secondary={item.address}
        /> <ListItemText
            primary={item.password}
            secondary={""}
        />

        <IconButton onClick={() => setOpen(!open)}>
            <KeyboardArrowDown

                sx={{
                   

                    transform: open ? 'rotate(-180deg)' : 'rotate(0)',
                    transition: '0.2s',
                }}
            />
        </IconButton>
        <IconButton edge="end" onClick={() => { editTeacher(item) }}>
            <EditOutlinedIcon />
        </IconButton>
    </ListItem>
        {open &&
            item.courses.map((c, index) => (
                <ListItem
                    onClick={() => { deleteCourse(c) }}
                    key={c._id}
                    sx={{ py: 0, minHeight: 32, color: 'rgb(113 157 202)' }}
                >
                    <IconButton aria-label="delete" disabled color="primary">
                        <ArrowRight />

                    </IconButton>
                    <ListItemIcon sx={{ color: 'inherit' }}>
                        <LibraryBooksIcon />
                    </ListItemIcon>
                    <ListItemText

                        primary={c.name}
                        primaryTypographyProps={{ fontSize: 13, fontWeight: '400', color: 'rgb(113 157 202)' }}
                        secondary={c.description + "-" + c.symbol}

                        secondaryTypographyProps={{ color: 'rgb(113 157 202)' }}
                    />
                </ListItem>))}</>

}