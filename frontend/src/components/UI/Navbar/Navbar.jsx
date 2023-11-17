import React, { useContext, useState } from 'react'
import CustomButton from '../CustomButton/CustomButton'
import classes from './Navbar.module.css'
import UserService from '../../../API/UserService'
import AuthContext from '../../../context/AuthContext'
import UserContext from '../../../context/UserContext'
import Calendar from '../../Calendar'
import Modal from '../Modal/Modal'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCalendar, faMapLocationDot, faBars} from '@fortawesome/free-solid-svg-icons'
import Map from '../../Map'
import CustomIcon from '../CustomIcon/CustomIcon'
import Sidebar from '../Sidebar/Sidebar'
import SidebarContent from '../../SidebarContent'



const Navbar = () => {

  const [sidebar, setSidebar] = useState(false)
  const [calendarModal, setCalendarModal] = useState(false)
  const [mapModal, setMapModal] = useState(false)
  const [readyToRender, setReadyToRender] = useState(false)


  const handleMapOpen = () => {
    const timeoutId = setTimeout(() => { // when modal have been opened then setTimeout
      setReadyToRender(true)
      return () => clearTimeout(timeoutId)
    }, 0)
    setMapModal(true)
  }
  

  return (
    <div className={classes.container}>
      <div className={classes.leftSide}>
        <CustomIcon><FontAwesomeIcon icon={faCalendar} onClick={() => setCalendarModal(true)}/></CustomIcon>
        <Modal visible={calendarModal} setVisible={setCalendarModal}>
          <Calendar />
        </Modal>
        <CustomIcon><FontAwesomeIcon icon={faMapLocationDot} onClick={handleMapOpen}/></CustomIcon>
        <Modal visible={mapModal} setVisible={setMapModal}>
          <Map readyToRender={readyToRender} />
        </Modal>
      </div>
      <div className={classes.brand}>
        PlanPro
      </div>
      <div className={classes.rightSide}>
        <CustomIcon><FontAwesomeIcon icon={faBars} onClick={() => setSidebar(true)}/></CustomIcon>
        <Sidebar visible={sidebar} setVisible={setSidebar}>
          <SidebarContent />
        </Sidebar>
      </div>
    </div>
  )
}

export default Navbar
