import { useEffect } from 'react';

import { getCurrentViewMonthAndYear, dateStringToTimeString, shortStr } from "./Utils";
import * as lessonTypes from "./lessonTypes";
import { Box, Avatar, Tooltip } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
// import {PlayArrowIcon} from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';



const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        •
    </Box>
);

// import SkipNextIcon from '@mui/icons-material/SkipNext';

export const EventTooltipContent = (props) => {

    useEffect(() => {
        console.log(props.event, "event")
    }, [props.event]);

    // <b>{shortStr(eventInfo.event.extendedProps.courseId.name)}</b>
    //     <i className="time">{eventInfo.event.extendedProps.fromTime ? dateStringToTimeString(eventInfo.event.extendedProps.fromTime) : 0}-{eventInfo.event.extendedProps.toTime ? dateStringToTimeString(eventInfo.event.extendedProps.toTime) : 0}</i>

    //     <i className="hours" dir="rtl"> {eventInfo.event.extendedProps.numHours + "שע'"} </i>
    console.log(props);
    return <Card sx={{ minWidth: "200px" }} >

        <CardContent>
            <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row-reverse" }}>

                <Typography component="div" sx={{ textAlign: "right", fontWeight: 400 }} variant="h6">
                    {props.event.event.extendedProps.courseId.name}
                </Typography>
                <div>


                    <Tooltip title="עריכה">
                        <IconButton onClick={props.onEdit}>

                            <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="מחיקה">
                        <IconButton onClick={props.onDelete}>
                            <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                    </Tooltip> </div>

            </div>
            <Typography variant="subtitle2" color="text.secondary" sx={{ textAlign: "right" }} component="div">
                {props.event.event.extendedProps.fromTime ? dateStringToTimeString(props.event.event.extendedProps.fromTime) : 0}-{props.event.event.extendedProps.toTime ? dateStringToTimeString(props.event.event.extendedProps.toTime) : 0}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" sx={{ direction: "rtl" }} component="div">
                {props.event.event.extendedProps.numHours}   שעורים

                {props.event.event.extendedProps.type &&
                    <>   {bull}  {props.event.event.extendedProps.type == lessonTypes.DISTANCE ? "למידה מרחוק" : props.event.event.extendedProps.type == lessonTypes.ABSENCE ? "היעדרות" : "פרונטלי"}
                    </>} </Typography>
            {props.event.event.extendedProps.comment && <Typography variant="subtitle2" sx={{ textAlign: "right" }} color="text.secondary" component="div">
                {props.event.event.extendedProps.comment}
            </Typography>}
        </CardContent>







    </Card>
}