// Calendar.js
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';
import { useState, useEffect } from 'react';
import styles from '../Modal.module.css';
import TokenDecoder from './Cookies';
const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const userdata = TokenDecoder();
  const userid = userdata ? userdata.id : null;
  const userrole = userdata ? userdata.role : null;
  useEffect(() => {
    const fetchmeetings = async () => {
      try {

        let url;
        if (userrole === "Admin") {
          url = `/api/Meeting/all`;
        }
        else if (userrole === "FOS") {
          url = `/api/Meeting/FOS/${userid}`;
        }
        else if (userrole === "BussinessHead") {
          url = `/api/Meeting/hiearchy?role=ATL&userid=${userid}`;
        }
        else if (userrole === "PNL") {
          url = `/api/Meeting/hiearchy?role=PNL&userid=${userid}`;
        }
        else if (userrole === "TL") {
          url = `/api/Meeting/hiearchy?role=TL&userid=${userid}`;
        }
        else if (userrole === "ATL") {
          url = `/api/Meeting/hiearchy?role=ATL&userid=${userid}`;
        }
        const response = await axios.get(url);
        const { data } = response.data;

        const transformedEvents = data.map((meeting) => ({
          title: meeting.Subject,
          start: meeting.MeetingDate,
          extendedProps: {
            meetingDetails: meeting,
          },
        }));
        setEvents(transformedEvents);

      } catch (error) {
      }
    };

    fetchmeetings();

  }, [userrole]);



  const handleEventClick = (eventInfo) => {
    setSelectedMeeting(eventInfo.event.extendedProps.meetingDetails);
  };

  const closeModal = () => {
    setSelectedMeeting(null);
  };

  return (
    <div>
      {selectedMeeting && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <span className={styles.closeButton} onClick={closeModal}>
              &times;
            </span>
            <div className="card-body mt-4">
              <h4>Meeting Details</h4>
              {selectedMeeting && (
                <div>
                  <p>Subject: {selectedMeeting.Subject}</p>
                  <p>Date: {selectedMeeting.MeetingDate}</p>
                  <p>Meeting Type: {selectedMeeting.MeetingType}</p>
                  <p>Developer: {selectedMeeting.Developer}</p>
                  <p>Sttaus oF Meeting: {selectedMeeting.Status}</p>
                  <p>Comment: {selectedMeeting.Comment}</p>

                  {/* Add more details as needed */}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={events}
        eventClick={handleEventClick}
      />
    </div>
  );
};

export default Calendar;
