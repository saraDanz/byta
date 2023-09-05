
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
import { Paper, Table, TableContainer, TableRow, TableCell, TableHead, TableBody } from "@mui/material"
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import Paper from '@mui/material/Paper';
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
import { Typography } from '@mui/material';
export default function TeacherListItem({ item, deleteTeacher, editFare, editTeacher, deleteTeacherFromCourse,withReports }) {
    const [open, setOpen] = useState(false);
    const deleteCourse = (course) => {
        if (window.confirm("האם המורה לא מלמדת בקורס " + course.name)) {
            try {


                axios.delete(BASE_URL + `teacherCourses/${item._id}/${course._id}`)
                    .then(res => {
                        deleteTeacherFromCourse(item._id, course._id)
                        alert("הסרת המורה מקורס" + course.name + "בוצעה בהצלחה")
                    })
                    .catch(err => {
                        console.log(err)
                        alert("שגיאה בהסרת המורה מהקורס\n לא ניתן להסיר מורה מקורס שלימדה בו בעבר")
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
            primary={item.email||"-"}
            secondary={item.address||"-"}
        /> <ListItemText
            primary={item.password||"-"}
            secondary={item.workerNum||"-"}
        />
        {withReports&&<ListItemText
            primaryTypographyProps={item.numReports == 0 ? { backgroundColor: 'green' } : {}}
            secondaryTypographyProps={item.courses && item.courses.reduce((accumulator, object) => {
                return accumulator + object.numReports;
            }, 0) != item.numReports ? { backgroundColor: 'red' } : {}}
            primary={"מספר דיווחים"}
            secondary={item.numReports}
        />}

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
        {(open && item.courses && item.courses.length > 0) && (
            <TableContainer component={Paper}>
                <Table >
                    <TableHead>
                        <TableRow>

                            <TableCell align="right">שם</TableCell>
                            <TableCell align="right">תאור</TableCell>
                            <TableCell align="right">סמל</TableCell>
                            <TableCell align="right">תעריף נסיעות</TableCell>
                            {withReports&&<TableCell align="right">מספר דיווחים</TableCell>}
                            <TableCell component="th" scope="row">
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {item.courses.map((row) => (
                            <TableRow key={row.name}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="right">
                                    {row.description}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="right">
                                    {row.symbol}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="right">
                                {row.fares && row.fares.length ? row.fares[row.fares.length - 1].rate : "-"}
                            </TableCell>
                            {withReports&& <TableCell style={{ width: 160 }} align="right">
                                    {row.numReports}
                                </TableCell>}
                  
                                <TableCell style={{ width: 160 }} align="right">
                                    <IconButton edge="end" aria-label="delete" onClick={() => { deleteCourse(row) }}>
                                        <DeleteOutlineIcon size="small" />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="delete" onClick={() => { editFare(row, item) }}>

                                        <EditOutlinedIcon size="small" />
                                    </IconButton>
                                </TableCell>

                            </TableRow>
                        ))}

                    </TableBody>


                </Table>
            </TableContainer>



            /* (
                <ListItem
            secondaryAction={
                <>   <IconButton edge="end" aria-label="delete" onClick={() => { deleteCourse(c) }}>
                    <DeleteOutlineIcon />
                </IconButton>

                </>
            }

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
                secondary={c.description + (c.symbol ? "-" : "") + c.symbol + (c.fares ? c.fares[c.fares.length - 1].rate + "!!!!" : "")}

                secondaryTypographyProps={{ color: 'rgb(113 157 202)' }}
            />

            {c.fares && <ListItemText
                primary=" תעריף נסיעות"
                secondary={c.fares[c.fares.length - 1].rate}
            />}
        </ListItem>)*/
        )}
        {open && item.courses && item.courses.length == 0 && (
            <Paper>

                <Typography style={{ textAlign: "center", padding: 15 }} >מורה זו אינה משוייכת לקורסים</Typography>

            </Paper>

        )
        }
    </>

}