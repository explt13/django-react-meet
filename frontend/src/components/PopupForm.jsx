import React, { useContext, useEffect, useState } from 'react'
import classes from './styles/PopupForm.module.css'
import CustomInput from './UI/CustomInput/CustomInput'
import CustomTextarea from './UI/textarea/CustomTextarea'
import CustomInputV2 from './UI/CustomInput/CustomInputV2'
import {getFormattedFullDate, getDateForInput} from './../utils/calendarUtil'
import CustomButton from './UI/CustomButton/CustomButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons'
import CustomIcon from './UI/CustomIcon/CustomIcon'
import MapContext from '../context/MapContext'
import CustomSelect from './UI/CustomSelect/CustomSelect'
import UserContext from '../context/UserContext'

// ADAPT FOR MOBILE!

const PopupForm = ({isOpen, setIsOpen}) => {
  const phrases = ['Let\'s go bowling..', 'Let\'s have a drink..', 'Let\'s have a walk..', 'let\'s go have lunch..', 'Would you like...']
  const [phrase, setPhrase] = useState(null)
  const [valid, setValid] = useState(true)
  const ind = Math.floor(Math.random() * phrases.length)
  const {setEventInformation, setCanAddMarkers, eventInformation, setCategory, minDate, maxDate} = useContext(MapContext)
  const [dateClasses, setDateClasses] = useState([classes.dateInput])
  const {eventCategories} = useContext(UserContext)

  useEffect(() => {
    setPhrase(phrases[ind])

  }, [isOpen])

  const handleCancelPopup = () => {
    setIsOpen(false)
    setEventInformation({text: '', time: minDate, category: 'HEALTH'})
    setCanAddMarkers(false)
  }

  const handleAcceptPopup = () => {
    if (valid){
      setIsOpen(false)
    }
    
  }


  const handleText = (ev) => { // i have default text so i dont need to validate this field
    setEventInformation(prevInformation => ({...prevInformation, text: ev.target.value}))
  }

  const handleDate = (ev) => {
    if (ev.target.value > maxDate || ev.target.value < minDate){
      setValid(false)
      setDateClasses(prevClasses => [...prevClasses, classes.invalidDate])
    } else{
      setValid(true)
      setDateClasses([classes.dateInput])
    }
    setEventInformation(prevInformation => ({...prevInformation, time: ev.target.value}))
  }

  const handleCategory = (ev) => {
    setEventInformation(prevInformation => ({...prevInformation, category: ev.target.value}))
  }

  return (
    <div className={classes.container}>
        <div className={classes.heading}>
          Create Event
        </div>
        <div className={classes.form}>
          <CustomTextarea placeholder={phrase} value={eventInformation.text} onChange={handleText} />
          <div className={classes.dateAndCategory}>


          <div className={dateClasses.join(' ')}>
            <label htmlFor='datePopup'>Date</label>
            <CustomInput id='datePopup' value={eventInformation.time} onChange={handleDate} type={'date'} min={minDate} max={maxDate} required/>
          </div>
          <div>
            <label htmlFor='categoryPopup'>Category</label>
            <CustomSelect id='categoryPopup' withNums={false} value={eventInformation.category} onChange={handleCategory} className={classes.categorySelect} defaultName='Categrory' options={eventCategories}
              />
          </div>

          
          </div>
        </div>
        <div className={classes.confirmation}>
          <CustomIcon className={classes.cancelPopup} onClick={handleCancelPopup}><FontAwesomeIcon icon={faXmark}/></CustomIcon>
          <CustomIcon className={classes.acceptPopup} onClick={handleAcceptPopup}><FontAwesomeIcon icon={faCheck}/></CustomIcon>
        </div>
    </div>
  )
}

export default PopupForm