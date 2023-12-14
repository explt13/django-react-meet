import React, { useEffect, useState } from 'react'
import classes from './styles/PopupForm.module.css'
import CustomInput from './UI/CustomInput/CustomInput'
import CustomTextarea from './UI/textarea/CustomTextarea'
import CustomInputV2 from './UI/CustomInput/CustomInputV2'
import {getFullDate} from './../utils/calendarUtil'
import CustomButton from './UI/CustomButton/CustomButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons'
import CustomIcon from './UI/CustomIcon/CustomIcon'

const PopupForm = ({setEventInformation, isOpen, setIsOpen, setCanAddMarkers}) => {
  const phrases = ['Let\'s go bowling..', 'Let\'s have a drink..', 'Let\'s have a walk..', 'let\'s go have lunch..', 'Would you like...']
  const [phrase, setPhrase] = useState(null)
  const [dateValue, setDateValue] = useState('')
  const [text, setText] = useState('')
  const [minDate, maxDate] = getFullDate()
  const ind = Math.ceil(Math.random() * phrases.length)

  useEffect(() => {
    setText('')
    setDateValue(minDate)
    setPhrase(phrases[ind-1])

  }, [isOpen])

  const handleCancelPopup = () => {
    setIsOpen(false)
    setCanAddMarkers(false)
  }

  const handleAcceptPopup = () => {
    setIsOpen(false)
  }


  const handleText = (ev) => {
    setText(ev.target.value)
    setEventInformation(prevInformation => ({...prevInformation, text: ev.target.value}))
  }

  const handleDate = (ev) => {
    setDateValue(ev.target.value)
    setEventInformation(prevInformation => ({...prevInformation, time: ev.target.value}))
  }

  return (
    <div className={classes.container}>
        <div className={classes.heading}>
          Create Event
        </div>
        <div className={classes.form}>
          <CustomTextarea placeholder={phrase} value={text} onChange={handleText} />
          <div className={classes.dateInput}>
            <label htmlFor='datePopup'>Date</label>
            <CustomInput id='datePopup' value={dateValue} onChange={handleDate} type={'date'} min={minDate} max={maxDate} required/>
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