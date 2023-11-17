import React, { useContext, useState } from 'react'
import CustomButton from '../CustomButton/CustomButton'
import classes from './Navbar.module.css'
import UserService from '../../../API/UserService'
import AuthContext from '../../../context/AuthContext'
import UserContext from '../../../context/UserContext'
import Calendar from '../../Calendar'
import Modal from '../Modal/Modal'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCalendar, faMapLocationDot} from '@fortawesome/free-solid-svg-icons'
import Map from '../../Map'
import CustomIcon from '../CustomIcon/CustomIcon'



const Navbar = () => {
  const {isAuth, setIsAuth, csrftoken} = useContext(AuthContext)
  const {userInformation, setUserInformation} = useContext(UserContext)
  const [calendarModal, setCalendarModal] = useState(false)
  const [mapModal, setMapModal] = useState(false)
  const logout = async () => {
      try {
        await UserService.logoutUser(csrftoken)
        setIsAuth(false)
        
      } catch (e) {
        console.log(e)
      }
  }

  return (
    <div className={classes.container}>
      <div className={classes.leftSide}>
        <CustomIcon><FontAwesomeIcon icon={faCalendar} onClick={() => setCalendarModal(true)}/></CustomIcon>
        <Modal visible={calendarModal} setVisible={setCalendarModal}>
          <Calendar />
        </Modal>
        <CustomIcon><FontAwesomeIcon icon={faMapLocationDot} onClick={() => setMapModal(true)}/></CustomIcon>
        <Modal visible={mapModal} setVisible={setMapModal}>
          <Map />
        </Modal>
      </div>
      <div className={classes.logout}><CustomButton onClick={logout}>Log out</CustomButton></div>
    </div>
  )
}

export default Navbar
