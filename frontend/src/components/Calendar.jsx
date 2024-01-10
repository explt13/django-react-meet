import React, { useContext, useEffect, useState } from 'react'
import classes from './styles/Calendar.module.css'
import UserContext from './../context/UserContext'
import { getDateInfo, getDaysInMonth, getFormattedFullDate, getMonthQty, getWeekdayIndex } from '../utils/calendarUtil'
import Loader from './UI/Loader/Loader'
import CustomTitle from './UI/CustomTitle/CustomTitle'
import { useNavigate } from 'react-router-dom'

const Calendar = () => {

const { recievedEvents, isLoading, thisUser } = useContext(UserContext)
  const [monthShift, setMonthShift] = useState(0)
  const [today, daysInMonth, monthName, year] = getDateInfo(monthShift)
  const [prevClasses, setPrevClasses] = useState([classes.prevButton])
  const [nextClasses, setNextClasses] = useState([classes.nextButton])
  const [monthQty, lastDay] = getMonthQty()
  const [acceptedEvents, setAcceptedEvents] = useState([])
  const [monthEvents, setMonthEvents] = useState({first: [], second: [], third: []})
  const currentMonthInd = new Date().getMonth()
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const dayClasses = []
  const navigate = useNavigate()

  useEffect(() => {
    if (recievedEvents){
      setAcceptedEvents([...recievedEvents].filter(event => event.recipients.find(recipient => recipient.username === thisUser.username).is_accepted === true))
    }
  }, [recievedEvents])

  useEffect(() => {
    if (acceptedEvents){
      setMonthEvents({
        first: acceptedEvents.filter(re => re.date.split('-')[1] == currentMonthInd + 1),
        second: acceptedEvents.filter(re => re.date.split('-')[1] == currentMonthInd + 2),
        third: acceptedEvents.filter(re => re.date.split('-')[1] == currentMonthInd + 3)}
        ) // + 1 cuz its index
    }
  }, [acceptedEvents])


  useEffect(() => {
    if (monthShift === monthQty){
      setNextClasses(prvClasses => [...prvClasses, classes.disabled])
    } else{
      setNextClasses([classes.nextButton])
    }
    if (monthShift === 0){
      setPrevClasses(prvClasses => [...prvClasses, classes.disabled])
    } else{
      setPrevClasses([classes.prevButton])
    }
  }, [monthShift])


  const handlePrevButton = () => {
    if (monthShift > 0){
      setMonthShift(prevVal => prevVal - 1)
    }
  }


  const handleNextButton = () => {
    if (monthShift < monthQty){
      setMonthShift(prevVal => prevVal + 1) // async
    }
  }

 
  const daysStyleHandler = (day) => {
    if (monthShift === 0) {

      if (!dayClasses.includes(classes.invalidDay) && day < today && day !== ' ') {
        dayClasses.push(classes.invalidDay);
      }
      if (day == today) {
        const prevDayInd = dayClasses.indexOf(classes.invalidDay);
        dayClasses.splice(prevDayInd, 1);
        dayClasses.push(classes.today);
      }
      if (dayClasses.includes(classes.today) && day != today) {
        const todayInd = dayClasses.indexOf(classes.today);
        dayClasses.splice(todayInd, 1);
      }
    }

    if (monthShift === monthQty) {
      if (!dayClasses.includes(classes.invalidDay) && day > lastDay) {
        dayClasses.push(classes.invalidDay);
      }
      
    }
  }


  const dayInformationHandler = (day) => {
    if (monthShift === 0){
      const eventDay = monthEvents.first.filter(event => event.date.split('-')[2] == day)
      if (eventDay.length > 0){

        if (!dayClasses.includes(classes.eventDay)){
          dayClasses.push(classes.eventDay)
        }
        return eventDay;
      }
      if (dayClasses.includes(classes.eventDay) && eventDay.length === 0){
        const eventDayInd = dayClasses.indexOf(classes.eventDay)
        dayClasses.splice(eventDayInd, 1)
        return;
      }
      return;
    }

    if (monthShift === 1){
      const eventDay = monthEvents.second.filter(event => event.date.split('-')[2] == day)
      if (eventDay.length > 0){
        if (!dayClasses.includes(classes.eventDay)){
          dayClasses.push(classes.eventDay)
        }
        return eventDay;
      }
      if (dayClasses.includes(classes.eventDay) && eventDay.length === 0){
        const eventDayInd = dayClasses.indexOf(classes.eventDay)
        dayClasses.splice(eventDayInd, 1)
        return;
      }
      return;
    }

    if (monthShift === 2){
      const eventDay = monthEvents.third.filter(event => event.date.split('-')[2] == day)
      if (eventDay.length > 0){
        if (!dayClasses.includes(classes.eventDay)){
          dayClasses.push(classes.eventDay)
        }
        return eventDay;
      }
      if (dayClasses.includes(classes.eventDay) && eventDay.length === 0){
        const eventDayInd = dayClasses.indexOf(classes.eventDay)
        dayClasses.splice(eventDayInd, 1)
        return;
      }
      return;
    }
  }


  return (
    isLoading
    ? <Loader />
    :
    <div className={classes.container}>
        <div className={classes.calendarHeader}>Upcoming Events</div>
        <div className={classes.month} id='month'>
            <div className={prevClasses.join(' ')} onClick={handlePrevButton}>&#10094;</div>
            <div className={classes.monthContent}>
            <div className={classes.monthName}>{monthName}</div>
            <div className={classes.year}>{year}</div>
            </div>
            <div className={nextClasses.join(' ')} onClick={handleNextButton}>&#10095;</div>
        </div>
        
        <div className={classes.weekdays}>
            {weekdays.map(weekday => (
            <div key={weekday} className={classes.weekday}>{weekday}</div>
            ))}
        </div>

        <div className={classes.calendarContainer}>
            {daysInMonth.map((day, index) => {
              daysStyleHandler(day)
              const eventInfomation = dayInformationHandler(day)

              return(
                  <div key={day + index} className={classes.day}>
                      {eventInfomation
                      ?
                      <CustomTitle data={eventInfomation && eventInfomation.map((event, index, arr) => ( // for PC only?
                      <div key={event.event_id} className={classes.eventInformation}>
                        <div>Requester: {event.requester.first_name + ' ' + event.requester.last_name}</div>
                        <div>Category: {event.category}</div>
                        <div>Time: {event.time}</div>
                        {index !== arr.length - 1 && <hr />}
                      </div>
                      ))}>
                        <span className={dayClasses.join(' ')} onClick={() => navigate('/map', {state: {date: eventInfomation[0].date}})}>{day}</span>
                      </CustomTitle>
                      
                      :
                      <span className={dayClasses.join(' ')}>{day}</span>
                      }
                  </div>
              )
            })}
        </div>
    </div>
  )
}

export default Calendar