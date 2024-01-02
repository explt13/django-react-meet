import React, { useState } from 'react'
import classes from './styles/CalendarPage.module.css'

import { getDateInfo, getDaysInMonth, getWeekdayIndex } from '../utils/calendarUtil'


const CalendarPage = () => {
  const [monthNum, setMonthNum] = useState(0)
  const [today, daysInMonth, monthName, year] = getDateInfo(monthNum)

  const handlePrev = () => {
    if (monthNum === 1){
      setMonthNum(0)
    }
    
  }
  const handleNext = () => {
    if (monthNum === 0){
      setMonthNum(1)
    }
    
  }

  return (
    <div className={['container', 'wrapper', classes.moduleContainer].join(' ')}>
      <div className={classes.month}>
        <div className={[classes.prev, monthNum === 0 ? classes.inactive : undefined].join(' ')} onClick={handlePrev}>&#10094;</div>
        <div className={classes.monthContent}>
          <div className={classes.monthName}>{monthName}</div>
          <div className={classes.year}>{year}</div>
        </div>
        <div className={[classes.next, monthNum === 1 ? classes.inactive : undefined].join(' ')} onClick={handleNext}>&#10095;</div>
      </div>
      
      <div className={classes.weekdays}>
        <div className={classes.weekday}>Mon</div>
        <div className={classes.weekday}>Tue</div>
        <div className={classes.weekday}>Wed</div>
        <div className={classes.weekday}>Thu</div>
        <div className={classes.weekday}>Fri</div>
        <div className={classes.weekday}>Sat</div>
        <div className={classes.weekday}>Sun</div>
      </div>

      <div className={classes.calendarContainer}>
        {daysInMonth.map((day, index) => {
        return <div key={day + index} className={classes.day}>{day == today && !(monthNum === 1) ? <span className={classes.today}>{day}</span> : day}</div>
        })}
      </div>
    </div>
  )
}

export default CalendarPage