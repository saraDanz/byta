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
const DisplayCalendar = () => {

  let dispatch = useDispatch();
  let navigate = useNavigate();

  let currentUser = useSelector(st => st.index.currentUser);
  let currentUserCourses = useSelector(st => st.index.courses);
  // const [showAdd, setShowAdd] = useState(false);
  const [selectInfo, setSelectInfo] = useState(null);
  const [editInfo, setEditInfo] = useState(null);
  let calendarComponentRef = useRef(null);

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
      axios.get(BASE_URL + "reports/" + currentUser._id).then(res => {
        console.log(res.data, "Sreports");


        res.data.forEach(element => {
          calendarApi.addEvent({ ...element, start: element.date })
        });

      }).catch(err => {
        console.log(err);
        alert("תקלה בהצגת הדווחים הקיימים")
      })
    }
  }, [currentUser]);

  useEffect(() => {

    if (!currentUser)
      navigate("/login")
  }, [currentUser]);
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  let pastSendingEnabled = currentUser && currentUser.role == 3 || true;

  const [changedEvents, setChangedEvents] = useState([]);


  const handleDateClick = (selectInfo) => {
    console.log(selectInfo);
    let date = selectInfo.start;
    //let today = new Date();
    // if (date.getMonth() == today.getMonth() && today.getDate() >= 20 || date.getMonth() != today.getMonth() && today.getDate() < 20)
    // setShowAdd(true);
    let d = getCurrentViewMonthAndYear();

    //נועדה לבדוק שלא לוחצים על תאירכיים מחודש קודם
    //א"א לדווח על חודשים קודמים
    // if (selectInfo.start.getMonth() == d.month)
    setSelectInfo(selectInfo);
  }
  const closeModal = () => {
    setSelectInfo(null);
  }
  const handleEventSaved = (object) => {
    let date = selectInfo.start;

    closeModal();

    // let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection
    let newEvent = {
      id: createEventId(),
      courseName: object.course.name,
      teacherId: currentUser._id,
      courseId: object.course,
      fromTime: object.fromTime,
      toTime: object.toTime,
      numHours: object.numHours,
      start: date,
      end: date,
      comment: object.comment,
      type: object.type,
      //  course:object.course,
      allDay: false
    }
    console.log("add", newEvent)
    calendarApi.addEvent(newEvent)
    setChangedEvents([...changedEvents, { ...newEvent, modelState: "added" }])
  }
  const handleEdit = (event) => {
    setEditInfo(event);
  }

  const handleSubmit = () => {
    let events = changedEvents.map(item => {
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
        }
      return item;
    })
    axios.put(BASE_URL + "reports", events).then(data => {
      console.log(data)

      alert("הדווח עודכן בהצלחה")
      navigate("/login");

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
      clickInfo.event.remove()
      if (clickInfo.event.extendedProps._id)
        setChangedEvents([...changedEvents, { id: clickInfo.event.extendedProps._id, modelState: "deleted" }])


    }
  }
  const handleEditSave = (clickInfo, object) => {
    console.log(object);

    let calendarApi = editInfo.view.calendar

   // calendarApi.unselect() // clear date selection
    let updatedEvent = {
        id:clickInfo.event.id,
      courseName: object.course.name,
      // teacherId: currentUser._id,
      courseId: object.course,
      fromTime: object.fromTime,
      toTime: object.toTime,
      numHours: object.numHours,
      //  start: date,
      //end: date,
      comment: object.comment,
      type: object.type,
      //  course:object.course,
      allDay: false
    }
   // clickInfo.event.extendedProps.courseId=object.course;
//     clickInfo.event.extendedProps.type=object.type;
//     clickInfo.event.extendedProps.comment=object.comment;
//     clickInfo.event.extendedProps.fromTime=object.fromTime;
//     clickInfo.event.extendedProps.toTime=object.toTime;
//     clickInfo.event.extendedProps.numHours=object.numHours;
//     clickInfo.event.extendedProps.allDay=false;
// clickInfo.event.updateEvent();
clickInfo.event.remove();
calendarApi.addEvent(updatedEvent);
    // clickInfo.event.extendedProps=updatedEvent;




        //console.log("update", updatedEvent)
    //calendarApi.updateEvent(updatedEvent)
//to do להוסיף בדיקה שאירוע זה טרם עודכן לפי שמוסיפים שוב למערך
    setChangedEvents([...changedEvents, { ...updatedEvent, modelState: "updated" }])
  }
  const handleEvents = (events) => {
    setCurrentEvents(events);

  }
  const closeEdit = () => {
    alert("closeEdit");
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
        <Tooltip  arrow title={<><EventTooltipContent event={eventInfo}
          onDelete={() => handleEventClick(eventInfo)}
          onEdit={() => handleEdit(eventInfo)}
        />

        </>} >

       

        <div className={"event-info " + (isPast ? "past" : "")} >
          <div>
            <b>{shortStr(eventInfo.event.extendedProps.courseId.name)}</b>
           


            className={"event-info " + (isPast ? "past" : "")} >
            <div>
              <p dir="rtl">{shortStr(eventInfo.event.extendedProps.courseId.name)}</p>


              <p className="hours" dir="rtl"> {eventInfo.event.extendedProps.numHours + "שעורים "} </p>

            </div>

            {/*  <Icon name="delete" size="small" onClick={() => handleEventClick(eventInfo)} />
            */}
          </div></div></Tooltip>
      </>
    )
  }
  return (
    <div className='demo-app'>
      <Button variant="contained" color="grey" className="btn-sub" onClick={handleSubmit}>שמירה</Button>



      <div className='demo-app-main'>
        <FullCalendar

          headerToolbar={pastSendingEnabled ? {
            start: 'prev next',
            center: 'title',
            end: ''
          } : {
              start: '',
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
      {selectInfo && <AddReportDialog selectInfo={selectInfo} onClose={closeModal} addReport={handleEventSaved} />}
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
export default DisplayCalendar;
