import React, { useState } from 'react'
import classes from '../styles/Calendar.module.css'
import { getDays, getRowsByDays, getDate, getThisDay } from '../utils/calendarUtil'

const Calendar = () => {
  const daysInMonth = getDays()
  const rows = getRowsByDays()
  const [year, month]= getDate()
  const today = getThisDay()

  return (
    
    <div className={classes.container}>
      {daysInMonth.map(day => {
        return <div key={day} className={day === today ? Array(classes.day, classes.today).join(' ') : classes.day}>{day}</div>
      })}
    </div>
  )
}

export default Calendar