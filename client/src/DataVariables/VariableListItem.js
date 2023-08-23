
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
import { BASE_URL } from '../VARIABLES';
// import {DeleteIcon }from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
export default function VariableListItem({ item,  editVariable }) {

   
    return <>
     <ListItem key={item._id}
        secondaryAction={
            <> 
              {/*<IconButton edge="end" aria-label="delete" onClick={() => { deleteTeacher(item) }}>
                <DeleteOutlineIcon />
        </IconButton>*/}

            </>
        }
    >

        <ListItemAvatar>
            <Avatar>
                <DataObjectOutlinedIcon /></Avatar>
        </ListItemAvatar>
        <ListItemText
            primary={"משמעות" }
            secondary={item.name}

        />
        <ListItemText
            primary={"שם"}
            secondary={item.key}
        /> <ListItemText
        primary={"ערך"}
        secondary={item.value}
    /><ListItemText
    primary={"סוג הנתון"}
    secondary={item.valueType}
/>
<ListItemText
    primary={"תאריך הזנת הנתון"}
    secondary={item.setDate}
/>
       
        <IconButton edge="end" onClick={() => { editVariable(item) }}>
            <EditOutlinedIcon />
        </IconButton>
    </ListItem>
      
                </>

}