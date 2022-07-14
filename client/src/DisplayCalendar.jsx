import React, { useState, useEffect, useRef } from 'react'
import FullCalendar, { formatDate } from '@fullcalendar/react'
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
import { getCurrentViewMonthAndYear } from "./Utils";
import { Button, Header, Icon, Modal } from 'semantic-ui-react'

// import {ReminderForm}from "./reminders/ReminderForm";
const DisplayCalendar = () => {
  let [initialEvents, setInitialEvents] = useState([]);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let currentUser = useSelector(st => st.currentUser);
  let currentUserCourses = useSelector(st => st.courses);
  // const [showAdd, setShowAdd] = useState(false);
  const [selectInfo, setSelectInfo] = useState(null);
  let calendarComponentRef = useRef(null);

  useEffect(() => {
    let calendarApi = calendarComponentRef.current.getApi();
    let d = getCurrentViewMonthAndYear();
    let date = new Date(d.year, d.month, 1);
    console.log(date);
    calendarApi.gotoDate(date);
    // calendarApi.gotoDate(new Date(2022,5,1));
    if (currentUser ) {
      if( !currentUserCourses)
      axios.get(BASE_URL + "teacherCourses/" + currentUser._id).then(res => {
        console.log(res.data);
        dispatch(saveCoursesOfCurrentUser(res.data))
      }).catch(err => {
        console.log(err);
        alert("תקלה בהצגת הקורסים האפשריים")
      })

      // axios.get(BASE_URL + "reports").then(res => {
        axios.get(BASE_URL + "reports/" + currentUser._id).then(res => {
        console.log(res.data,"Sreports");
        // dispatch(saveCoursesOfCurrentUser(res.data))
        setInitialEvents(res.data.map((item) => { return { ...item, start: item.date } }))
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
  let pastSendingEnabled = currentUser && currentUser.role == 3;




  const handleDateClick = (selectInfo) => {
    console.log(selectInfo);
    let date = selectInfo.start;
    //let today = new Date();
    // if (date.getMonth() == today.getMonth() && today.getDate() >= 20 || date.getMonth() != today.getMonth() && today.getDate() < 20)
    // setShowAdd(true);
    let d = getCurrentViewMonthAndYear();

    //נועדה לבדוק שלא לוחצים על תאירכיים מחודש קודם
    //א"א לדווח על חודשים קודמים
    if (pastSendingEnabled || selectInfo.start.getMonth() == d.month)
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

    calendarApi.addEvent({
      id: createEventId(),
      courseName: object.course.name,
      teacherId: currentUser._id,
      // teacherId: "624d4ed9bc1d81e3e89ad480",
      courseId: object.course.id,

      fromTime: object.fromTime,
      toTime: object.toTime,
      numHours: object.numHours,
      // subject: { type: String, default: "" },

      start: date,
      end: date,


      allDay: false
    })

  }
  const handleSubmit = () => {
    let events = currentEvents.map(item => {
      return {
        teacherId: currentUser._id,
        date: item.start,
        fromTime: item.extendedProps.fromTime,
        toTime: item.extendedProps.toTime,
        numHours: item.extendedProps.numHours,
        courseId: item.extendedProps.courseId,
        courseName: item.extendedProps.courseName,
      }
    })
    axios.post(BASE_URL + "reports/addReports", events).then(data => {
      console.log(data)
      dispatch(logOut())
      alert("הדווח הוגש בהצלחה")
      navigate("/login");

    }
    )
      .catch(err => {
        alert('התרחשה שגיאה בהגשת הדווח')
        console.log(err);
      });
  }
  const handleEventClick = (clickInfo) => {

    if (window.confirm(`האם למחוק את השיעור '${clickInfo.event.extendedProps.courseName}'`)) {
      clickInfo.event.remove()
    }
  }

  const handleEvents = (events) => {
    setCurrentEvents(events);
    console.log(events)
  }
  function renderEventContent(eventInfo) {
    console.log(eventInfo)
    console.log(eventInfo.event.extendedProps.numHours, "numhours")

    return (
      <>
        {/*  <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.extendedProps.title}</i>*/}
        <div className="event-info">
          <div>
            <b>{eventInfo.event.extendedProps.courseName}</b>

            <i className="time">{eventInfo.event.extendedProps.fromTime}-{eventInfo.event.extendedProps.toTime}</i>

            <i className="hours" dir="rtl"> {eventInfo.event.extendedProps.numHours + "שע'"} </i>

          </div>

          <Icon name="delete" size="small" onClick={() => handleEventClick(eventInfo)} />

        </div>
      </>
    )
  }
  return (
    <div className='demo-app'>
      <Button onClick={handleSubmit}>שליחת הדווח</Button>


      <div className='demo-app-main'>
        <FullCalendar

          headerToolbar={pastSendingEnabled ? {
            start: 'today',
            center: 'title',
            end: 'prev next'
          } : {
              start: '',
              center: 'title',
              end: ''
            }}
          ref={calendarComponentRef}
          // showNonCurrentDates="true"
          // defaultDate={new Date(2020,10,10)}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialEvents={initialEvents}
          initialView='dayGridMonth'
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          // alternatively, use the `events` setting to fetch from a feed
          select={handleDateClick}
          eventContent={renderEventContent} // custom render function
          eventClick={handleEventClick}
          eventsSet={handleEvents} // called after events are initialized/added/changed/removed
          /* you can update a remote database when these fire:*/
          eventAdd={function (w) { console.log(w) }}
        /*  eventChange={function(){}}
         eventRemove={function(){}}
         */
        />
      </div>
      {selectInfo && <AddReportForm onClose={closeModal} addReport={handleEventSaved} />}
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