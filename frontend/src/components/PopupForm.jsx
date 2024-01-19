import React, { useContext, useEffect, useState } from 'react'
import classes from './styles/PopupForm.module.css'
import CustomInput from './UI/CustomInput/CustomInput'
import CustomTextarea from './UI/textarea/CustomTextarea'
import {getFormattedFullDate, getDateForInput, getCutTime} from './../utils/calendarUtil'
import CustomButton from './UI/CustomButton/CustomButton'
import CustomAcceptButton from './UI/CustomButton/CustomAcceptButton'
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
  const ind = Math.floor(Math.random() * phrases.length)
  const [timeValid, setTimeValid] = useState(false)
  const {setEventInformation, setCanAddMarkers, eventInformation, minDate, maxDate} = useContext(MapContext)
  const [textClasses, setTextClasses] = useState([])
  const [timeClasses, setTimeClasses] = useState([])
  const [categoryClasses, setCategoryClasses] = useState([classes.categorySelect])
  const [selectedUsersClasses, setSelectedUsersClasses] = useState([classes.sendTo])
  const {eventCategories, friends, isLoading} = useContext(UserContext)
  const [dropdown, setDropdown] = useState(false)
  const initialUser = eventInformation.selectedUsers[0]
  const time = new Date().toLocaleTimeString()
  const now = getCutTime(time)

  useEffect(() => {
    setPhrase(phrases[ind])
  }, [isOpen])

  useEffect(() => {
    if (dropdown){
      setSelectedUsersClasses(prevClasses => [...prevClasses, classes.active])
    } else {
      setSelectedUsersClasses(selectedUsersClasses.filter(cls => cls !== classes.active))
    }
  }, [dropdown])

  useEffect(() => {
    if (eventInformation.selectedUsers.length > 0){
      setSelectedUsersClasses(selectedUsersClasses.filter(cls => cls !== classes.invalid))
    }
  }, [eventInformation.selectedUsers])

  useEffect(() => {
    if (eventInformation.time && (minDate < eventInformation.date)){
      setTimeValid(true)
      setTimeClasses([])
    }
  }, [minDate, eventInformation.date])


  const handleOutsideUsersSelect = (ev) => {
    const dropdownElement = document.getElementById('selectUsers');
    if (dropdownElement && !dropdownElement.contains(ev.target)) {
      setDropdown(false);
    }
  }
    
  const handleCancelPopup = () => {
    setIsOpen(false)
    setEventInformation({text: '', date: minDate, time: '', category: '', selectedUsers: []})
    setCanAddMarkers(false)
  }

  const handleAcceptPopup = () => {
    if (eventInformation.selectedUsers.length === 0){
      if (!selectedUsersClasses.includes(classes.invalid))
        setSelectedUsersClasses(prevClasses => [...prevClasses, classes.invalid])
    }
    if(!eventInformation.text){
      if (!textClasses.includes(classes.textInvalid)){
        setTextClasses(prevClasses => [...prevClasses, classes.textInvalid])
      } 
    }
    if (!eventInformation.category){
      if (!categoryClasses.includes(classes.categoryInvalid)){
        setCategoryClasses(prevClasses => [...prevClasses, classes.categoryInvalid])
      }
    }
    if (!eventInformation.time){
      if (!timeClasses.includes(classes.timeInvalid)){
        setTimeClasses(prevClasses => [...prevClasses, classes.timeInvalid])
      }
    }
    if (timeValid && eventInformation.selectedUsers.length > 0 && eventInformation.text && eventInformation.category){
      setIsOpen(false)
    }
  }

  const handleText = (ev) => { // i have default text so i dont need to validate this field
    if (ev.target.value){
      setTextClasses([])
    }
    setEventInformation(prevInformation => ({...prevInformation, text: ev.target.value}))

  }

  const handleDate = (ev) => {
    if (!(ev.target.value > maxDate) && !(ev.target.value < minDate)){
      setEventInformation(prevInformation => ({...prevInformation, date: ev.target.value}))
    }
  }
  

  const handleTime = (ev) => {
    if (ev.target.value < now && eventInformation.date === minDate){
      setTimeValid(false)
      if (!timeClasses.includes(classes.invalidTime)){
        setTimeClasses(prevClasses => [...prevClasses, classes.timeInvalid])
      } 
    } else {
      setTimeValid(true)
      setTimeClasses([])
    }
    setEventInformation(prevInformation => ({...prevInformation, time: ev.target.value}))
  }
  

  const handleCategory = (ev) => {
    setEventInformation(prevInformation => ({...prevInformation, category: ev.target.value}))
    setCategoryClasses([classes.categorySelect])
  }
 

  const handleUsers = (ev, username, firstName, lastName) => {
    const alreadySelected = eventInformation.selectedUsers.find(u => u.username === username)
    ev.currentTarget.classList.toggle(classes.active)
    if (alreadySelected){
      setEventInformation(prevInformation => ({...prevInformation, selectedUsers: prevInformation.selectedUsers.filter(su => su.username !== username)}))
    } else if (!alreadySelected){
      setEventInformation(prevInformation => ({...prevInformation, selectedUsers: [...prevInformation.selectedUsers, {username: username, first_name: firstName, last_name: lastName}]}))

    }
  }

  return (
    isLoading
    ? <Loader />
    :
    <div className={classes.container} onClick={handleOutsideUsersSelect}>
        <div className={classes.heading}>
          Create Event
        </div>
        <div className={classes.form}>
          <CustomTextarea className={textClasses.join(" ")} placeholder={phrase} value={eventInformation.text} onChange={handleText} />
          <div className={classes.formFields}>
            <div className={classes.dateAndCategory}>
              <div className={classes.dateInput}>
                <label htmlFor='datePopup'>Date</label>
                <div className={classes.datetime} id='datePopup'>
                  <CustomInput value={eventInformation.date} onChange={handleDate} type={'date'} min={minDate} max={maxDate}/>
                  <CustomInput className={timeClasses.join(' ')} value={eventInformation.time} onChange={handleTime} type={'time'} min={now} required/>
                </div>
              </div>
              <div className={classes.category}>
                <label htmlFor='categoryPopup'>Category</label>
                <CustomSelect id='categoryPopup' value={eventInformation.category ? eventInformation.category : 'defaultValue'} onChange={handleCategory} className={categoryClasses.join(' ')} defaultName='Categrory' options={eventCategories}/>
              </div>
            </div>
            <div className={selectedUsersClasses.join(' ')} id='selectUsers' onClick={() => setDropdown(!dropdown)}>
              <div className={classes.userSelectHeading} >
                <div className={classes.userSelectInformation}><div className={classes.userSelectInformationPlaceholder}>Send to:&nbsp;</div><div className={classes.selectedUsersShow}>{eventInformation.selectedUsers.map(su => (<span key={su.username}>{su.first_name} {su.last_name}&nbsp;</span>))}</div></div>
                <div className={classes.userSelectDropIcon}><FontAwesomeIcon icon={faSquareCaretDown} /></div>
              </div>
              <div className={classes.userSelectContent}>
              {friends.map(friend => (
                <div
                  key={friend.username}
                  className={[friend.username === initialUser?.username ? classes.active : undefined, classes.userSelectOption].join(' ')}
                  onClick={(ev) => handleUsers(ev, friend.username, friend.first_name, friend.last_name)}>{friend.first_name} {friend.last_name}
                </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={classes.confirmation}>
          <CustomButton className={classes.acceptPopup} onClick={handleAcceptPopup}>Create event</CustomButton>
        </div>
    </div>
  )
}

export default PopupForm