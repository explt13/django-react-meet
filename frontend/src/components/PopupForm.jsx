import React, { useContext, useEffect, useState } from 'react'
import classes from './styles/PopupForm.module.css'
import CustomInput from './UI/CustomInput/CustomInput'
import CustomTextarea from './UI/textarea/CustomTextarea'
import CustomInputV2 from './UI/CustomInput/CustomInputV2'
import {getFormattedFullDate, getDateForInput} from './../utils/calendarUtil'
import CustomButton from './UI/CustomButton/CustomButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faCheck, faSquareCaretDown } from '@fortawesome/free-solid-svg-icons'
import CustomIcon from './UI/CustomIcon/CustomIcon'
import MapContext from '../context/MapContext'
import CustomSelect from './UI/CustomSelect/CustomSelect'
import UserContext from '../context/UserContext'
import Loader from './UI/Loader/Loader'

// ADAPT FOR MOBILE!

const PopupForm = ({isOpen, setIsOpen}) => {
  const phrases = ['Let\'s go bowling..', 'Let\'s have a drink..', 'Let\'s have a walk..', 'let\'s go have lunch..', 'Would you like...']
  const [phrase, setPhrase] = useState(null)
  const [valid, setValid] = useState(true)
  const ind = Math.floor(Math.random() * phrases.length)
  const {setEventInformation, setCanAddMarkers, eventInformation, minDate, maxDate} = useContext(MapContext)
  const [dateClasses, setDateClasses] = useState([classes.dateInput])
  const [selectedUsersClasses, setSelectedUsersClasses] = useState([classes.sendTo])
  const {eventCategories, friends, isLoading} = useContext(UserContext)
  const [dropdown, setDropdown] = useState(false)
  const initialUser = eventInformation.selectedUsers[0]
  

  useEffect(() => {
    setPhrase(phrases[ind])

  }, [isOpen])

  const handleCancelPopup = () => {
    setIsOpen(false)
    setEventInformation({text: '', time: minDate, category: 'HEALTH', selectedUsers: []})
    setCanAddMarkers(false)
  }

  const handleAcceptPopup = () => {
    if (valid){
      setIsOpen(false)
    }
    
  }
  useEffect(() => {
    
    if (eventInformation.selectedUsers.length === 0){
      setSelectedUsersClasses(prevClasses => [...prevClasses, classes.invalid])
      setValid(false)
    } else{
      console.log(eventInformation.selectedUsers)
      setSelectedUsersClasses([classes.sendTo])
      setValid(true)
    }
  }, [eventInformation.selectedUsers])


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


  const handleUsers = (ev, username) => {
    const alreadySelected = eventInformation.selectedUsers.find(u => u.username === username)
    ev.currentTarget.classList.toggle(classes.active)

    if (alreadySelected){
      setEventInformation(prevInformation => ({...prevInformation, selectedUsers: prevInformation.selectedUsers.filter(su => su.username !== username)}))

    } else if (!alreadySelected){
      setEventInformation(prevInformation => ({...prevInformation, selectedUsers: [...prevInformation.selectedUsers, {username: username, is_accepted: false}]}))

    }
  }


  return (
    isLoading
    ? <Loader />
    :
    <div className={classes.container}>
        <div className={classes.heading}>
          Create Event
        </div>
        <div className={classes.form}>
          <CustomTextarea placeholder={phrase} value={eventInformation.text} onChange={handleText} />
          <div className={classes.formFields}>
            <div className={classes.dateAndCategory}>
              <div className={dateClasses.join(' ')}>
                <label htmlFor='datePopup'>Date</label>
                <CustomInput id='datePopup' value={eventInformation.time} onChange={handleDate} type={'date'} min={minDate} max={maxDate} required/>
              </div>
              <div>
                <label htmlFor='categoryPopup'>Category</label>
                <CustomSelect id='categoryPopup' onChange={handleCategory} className={classes.categorySelect} defaultName='Categrory' options={eventCategories}/>
              </div>
            </div>
            <div className={selectedUsersClasses.join(' ')}>
              <div className={classes.userSelectHeading}>
                <div className={classes.userSelectInformation}><div className={classes.userSelectInformationPlaceholder}>Send to:&nbsp;</div><div className={classes.selectedUsersShow}>{eventInformation.selectedUsers.map(su => (<span key={su.username}>{su.username}&nbsp;</span>))}</div></div>
                <div className={classes.userSelectDropIcon} onClick={() => setDropdown(!dropdown)}><FontAwesomeIcon icon={faSquareCaretDown} /></div>
              </div>
              <div className={[classes.userSelectContent, dropdown ? classes.active : undefined].join(' ')} id='selectUsers'>
              {friends.map(friend => (
                <div
                  key={friend.username}
                  className={[friend.username === initialUser?.username ? classes.active : undefined, classes.userSelectOption].join(' ')}
                  onClick={(ev) => handleUsers(ev, friend.username)}>{friend.username}
                </div>
                ))}
              </div>
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