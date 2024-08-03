// components/DateRangePicker.js
import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { addDays } from 'date-fns';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
const DateRangePicker = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 7));

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (date > endDate) {
      setEndDate(date);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (date < startDate) {
      setStartDate(date);
    }
  };

  return (
    <div className="d-flex justify-content-between">
      <div className="d-flex justify-content-between">
        <DateTimePicker
          className="form-control"
          onChange={handleStartDateChange}
          value={startDate}
          format="y-MM-dd"
        />
      </div>
      <div className="d-flex px-5 justify-content-between">
        <DateTimePicker
          className="form-control"
          onChange={handleEndDateChange}
          value={endDate}
          minDate={startDate}
          format="y-MM-dd"
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
