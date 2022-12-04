import React, { useState, useEffect, useRef } from 'react'
import FullCalendar, { formatDate, CalendarApi } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './event-utils'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { logOut, saveCoursesOfCurrentUser } from './store/actions';
import { BASE_URL } from './VARIABLES';
import { useNavigate } from 'react-router';
import AddReportForm from './AddReportFormNot';
import { Popover, Tooltip, Button } from "@mui/material";
import { getCurrentViewMonthAndYear, dateStringToTimeString, shortStr } from "./Utils";
// import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import EditReportDialog from "./EditReportDialog";
import AddReportDialog from "./AddReportDialog";
import { EventTooltipContent } from './EventTooltipContent';
import "./DisplayCalendar.css";

import SaveIcon from '@mui/icons-material/Save';


const AAAcopy = () => {

  let dispatch = useDispatch();
  // let navigate = useNavigate();
  let [eve, setEve] = useState([

  ]);
  let currentUser = useSelector(st => st.index.currentUser);
  let currentUserCourses = useSelector(st => st.index.courses);
  // const [showAdd, setShowAdd] = useState(false);
  const [selectInfo, setSelectInfo] = useState(null);
  const [editInfo, setEditInfo] = useState(null);
  let calendarComponentRef = useRef(null);
  const [changedEvents, setChangedEvents] = useState([]);

  useEffect(() => {
    let calendarApi = calendarComponentRef.current.getApi();
    let d = getCurrentViewMonthAndYear();
    let date = new Date(d.year, d.month, 1);

    calendarApi.gotoDate(date);
    // calendarApi.gotoDate(new Date(2022,5,1));
    if (currentUser) {
      if (!currentUserCourses || !currentUserCourses.length)
        axios.get(BASE_URL + "teacherCourses/" + currentUser._id).then(res => {

          dispatch(saveCoursesOfCurrentUser(res.data))
        }).catch(err => {
          console.log(err);
          alert("תקלה בהצגת הקורסים האפשריים")
        })

      // axios.get(BASE_URL + "reports").then(res => {
      if (!eve.length)
        axios.get(BASE_URL + "reports/" + currentUser._id).then(res => {
          console.log(res.data, "Sreports");


          // res.data.forEach(element => {
          //   calendarApi.addEvent({ ...element, start: element.date })
          // });
          setEve([...eve, ...res.data]);

        }).catch(err => {
          console.log(err);
          alert("תקלה בהצגת הדווחים הקיימים")
        })
    }
  }, [currentUser]);

  useEffect(() => {
    console.log("update changes ", changedEvents);


  }, [changedEvents])
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const handleAddSave = (object) => {
    let calendarApi = selectInfo.view.calendar;
    calendarApi.unselect() // clear date selection
    let newEvent = {

      id: createEventId(),
      courseName: object.course.name,
      teacherId: currentUser._id,
      courseId: object.course,
      fromTime: object.fromTime,
      toTime: object.toTime,
      numHours: object.numHours,
      start: selectInfo.start,

      comment: object.comment,
      type: object.type,


    }
    setEve([...eve, newEvent])
    setChangedEvents([...changedEvents, { ...newEvent, modelState: "added" }])

  }

  const handleDateClick = (selectInfo) => {
    setSelectInfo(selectInfo)


    // let newEvent = {
    //   id: createEventId(),
    //   courseName: object.course.name,
    //   teacherId: currentUser._id,
    //   courseId: object.course,
    //   fromTime: object.fromTime,
    //   toTime: object.toTime,
    //   numHours: object.numHours,
    //   start: date,
    //   end: date,
    //   comment: object.comment,
    //   type: object.type,
    //   //  course:object.course,
    //   allDay: false
    // }
    // console.log("add", newEvent)
    // calendarApi.addEvent(newEvent)
    // setChangedEvents([...changedEvents, { ...newEvent, modelState: "added" }])

  }
  const closeAddDialog = () => {
    setSelectInfo(null);
  }
  // const handleEventSaved = (object) => {
  //   let date = selectInfo.start;
  //   closeModal();
  //   let calendarApi = selectInfo.view.calendar

  //   calendarApi.unselect() // clear date selection
  //   let newEvent = {
  //     id: createEventId(),
  //     courseName: object.course.name,
  //     teacherId: currentUser._id,
  //     courseId: object.course,
  //     fromTime: object.fromTime,
  //     toTime: object.toTime,
  //     numHours: object.numHours,
  //     start: date,
  //     end: date,
  //     comment: object.comment,
  //     type: object.type,
  //     //  course:object.course,
  //     allDay: false
  //   }
  //   console.log("add", newEvent)
  //   calendarApi.addEvent(newEvent)
  //   setChangedEvents([...changedEvents, { ...newEvent, modelState: "added" }])
  // }
  const handleEdit = (event) => {
    setEditInfo(event);
  }

  const handleSubmit = () => {
    let eventsToSend = changedEvents.map(item => {
      if (item.modelState == "added")
        return {
          teacherId: currentUser._id,
          date: item.start,
          fromTime: item.fromTime,
          toTime: item.toTime,
          numHours: item.numHours,
          courseId: item.courseId._id,
          courseName: item.courseName,
          comment: item.comment,
          type: item.type,
          modelState: "added"
        };
      else if (item.modelState == "updated")
        return {
          _id: item._id,
          teacherId: currentUser._id,
          date: item.start,
          fromTime: item.fromTime,
          toTime: item.toTime,
          numHours: item.numHours,
          courseId: item.courseId._id,
          courseName: item.courseName,
          comment: item.comment,
          type: item.type,
          modelState: "updated"
        }
      return item;
    })
    axios.put(BASE_URL + "reports", eventsToSend).then(data => {
      console.log(data)

      alert("הדווח עודכן בהצלחה")
      //  navigate("/login");
      setChangedEvents([])

    }
    )
      .catch(err => {
        alert('התרחשה שגיאה בהגשת הדווח')
        console.log(err);
      });
  }
  const handleEventClick = (clickInfo) => {
    //handleEdit(clickInfo)
    let d = getCurrentViewMonthAndYear();
    //  if (clickInfo.event.start.getMonth() == d.month && clickInfo.event.start.getFullYear() == d.year)

    if (window.confirm(`האם למחוק את השיעור '${clickInfo.event.extendedProps.courseName}'`)) {
      // clickInfo.event.remove()
      let e = [...eve];
      let index = clickInfo.event.id ? e.findIndex(o => o.id == clickInfo.event.id) : e.findIndex(o => o._id == clickInfo.event.extendedProps._id)
      e.splice(index, 1);
      setEve(e);
      if (clickInfo.event.extendedProps._id) {
        let ind = changedEvents.findIndex(o => o.id == clickInfo.event.id);
        let temp = [...changedEvents]
        if (ind > -1)

          temp.splice(ind, 1);

        setChangedEvents([...temp, { id: clickInfo.event.extendedProps._id, modelState: "deleted" }])
      } else {
        let ind = changedEvents.findIndex(o => o.id == clickInfo.event.id)
        let temp = [...changedEvents]
        temp.splice(ind, 1)
        setChangedEvents(temp);
      }

    }
  }
  const handleEditSave = (object) => {
    console.log(object);

    let calendarApi = editInfo.view.calendar

    // calendarApi.unselect() // clear date selection
    let updatedEvent = {
      id: editInfo.event.id,
      courseName: object.course.name,
      // teacherId: currentUser._id,
      courseId: object.course,
      fromTime: object.fromTime,
      toTime: object.toTime,
      numHours: object.numHours,
      start: editInfo.event.start,
      //end: date,
      comment: object.comment,
      type: object.type,
      //  course:object.course,
      allDay: false
    }
    //צריך לבדוק שזה מדויק
    if (editInfo.event.extendedProps._id) {
      updatedEvent._id = editInfo.event.extendedProps._id;
      let removeDupUpdates = changedEvents.filter(o => !o._id || o._id != editInfo.event.extendedProps._id);
      setChangedEvents([...removeDupUpdates, { ...updatedEvent, modelState: "updated" }])
    } else {
      let removeDupUpdates = changedEvents.filter(o => !o.id || o.id != editInfo.event.id);

      setChangedEvents([...removeDupUpdates, { ...updatedEvent, modelState: "added" }])

    }
    let e = [...eve];
    let index = editInfo.event.id ? e.findIndex(o => o.id == editInfo.event.id) : e.findIndex(o => o._id == editInfo.event.extendedProps._id)


    e = e.map((item, ind) => { if (index == ind) return updatedEvent; return item; })

    setEve(e);


    // console.log("update", updatedEvent)
    // calendarApi.updateEvent(updatedEvent)
    //to do להוסיף בדיקה שאירוע זה טרם עודכן לפי שמוסיפים שוב למערך
  }
  const handleEvents = (events) => {
    setCurrentEvents(events);

  }
  const closeEdit = () => {

    setEditInfo(null);
  }
  // useEffect(() => {
  //   console.log("currentEvents", currentEvents);
  // }, [currentEvents])
  useEffect(() => {
    console.log("changedEvents", changedEvents);
  }, [changedEvents])
  function renderEventContent(eventInfo) {
    //  debugger;
    let d = getCurrentViewMonthAndYear();

    let isPast = !(eventInfo.event.start.getMonth() == d.month && eventInfo.event.start.getFullYear() == d.year)
    return (
      <>
        <Tooltip arrow title={<><EventTooltipContent event={eventInfo}
          onDelete={() => handleEventClick(eventInfo)}
          onEdit={() => handleEdit(eventInfo)}
        />

        </>} >

          <div
            //   aria-owns={ancorElPopover ? 'mouse-over-popover' : undefined}
            // aria-haspopup="true"

            className={"event-info " + (isPast ? "past" : "")} >
            <div>
              <b dir="rtl">{eventInfo.event.extendedProps.courseId.name}</b>


              <p className="hours" dir="rtl"> {eventInfo.event.extendedProps.numHours + "שעורים"} </p>

            </div>

            {/*  <Icon name="delete" size="small" onClick={() => handleEventClick(eventInfo)} />
            */}
          </div></Tooltip>
      </>
    )
  }
  return (
    <div className='demo-app'>
      {/*   <Button variant="outlined" className="btn-sub" endIcon={<SaveIcon />} onClick={handleSubmit}>  שמירה </Button>*/}



      <div className='demo-app-main'>
        <FullCalendar

          customButtons={{
            myCustomButton: {
              text: 'שמירה',
              click: function () {
                handleSubmit()
              }
            }
          }}
          titleFormat={{ year: 'numeric', month: 'numeric' }}
          headerToolbar={{
            start: 'prev next myCustomButton',
            center: 'title',
            end: ''
          }}
          ref={calendarComponentRef}
          // showNonCurrentDates="true"
          // defaultDate={new Date(2020,10,10)}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}

          initialView='dayGridMonth'
          editable={true}
          disableDragging={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}

          weekends={weekendsVisible}
          events={eve}
          // alternatively, use the `events` setting to fetch from a feed
          select={handleDateClick}
          eventContent={renderEventContent} // custom render function
          /*   eventClick={handleEventClick}*/
          eventsSet={handleEvents} // called after events are initialized/added/changed/removed
          /* you can update a remote database when these fire:*/
          eventAdd={function (w) { console.log(w) }}
        /*  eventChange={function(){}}
         eventRemove={function(){}}
         */
        />
      </div>
      {/*selectInfo && <AddReportForm onClose={closeModal} addReport={handleEventSaved} />*/}
      {selectInfo && <AddReportDialog selectInfo={selectInfo} onClose={closeAddDialog} addReport={handleAddSave} />}
      {editInfo && <EditReportDialog handleEditSave={handleEditSave} event={editInfo} onClose={closeEdit} />}
    </div>
  )






}



function renderSidebarEvent(event) {
  return (
    <li key={event.id}>
      <b>{formatDate(event.start, { year: 'numeric', month: 'short', day: 'numeric' })}</b>
      <i>{event.title}</i>
    </li>
  )
}
export default AAAcopy;