import React, { useContext, useState } from 'react'
import CustomButton from '../CustomButton/CustomButton'
import classes from './Navbar.module.css'
import UserService from '../../../API/UserService'
import AuthContext from '../../../context/AuthContext'
import UserContext from '../../../context/UserContext'
import Calendar from '../../Calendar'
import Modal from '../Modal/Modal'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCalendar, faMapLocationDot, faBars, faHouse, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import Map from '../../Map'
import CustomIcon from '../CustomIcon/CustomIcon'
import Sidebar from '../Sidebar/Sidebar'
import SidebarContent from '../../SidebarContent'
import { Link, useNavigate } from 'react-router-dom'
import CustomInput from '../CustomInput/CustomInput'
import Search from '../Search/Search'
import UsersList from '../../UsersList'
import MapComp from '../../MapComp'



const Navbar = () => {
  const { friends } = useContext(UserContext)
  const [sidebar, setSidebar] = useState(false)
  const [calendarModal, setCalendarModal] = useState(false)
  const [mapModal, setMapModal] = useState(false)
  const [readyToRender, setReadyToRender] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const handleMapOpen = () => {
    const timeoutId = setTimeout(() => { // when modal have been opened then setTimeout
      setReadyToRender(true)
    }, 0)
    setMapModal(true)
    return () => clearTimeout(timeoutId)
  }


  const navigate = useNavigate()

  const handleSearch = async (e) => {
    if (e.key === 'Enter' || e.type === 'click'){
        navigate(`/search?username=${searchValue}`) // hardcoded as well need to improve
    }
  }



  return (
    <div className={[classes.container, 'navbar'].join(' ')}>
      <div className={classes.leftSide}>
        <Link to='/'><CustomIcon><FontAwesomeIcon icon={faHouse} /></CustomIcon></Link>
        <CustomIcon><FontAwesomeIcon icon={faCalendar} onClick={() => setCalendarModal(true)}/></CustomIcon>
        <Modal visible={calendarModal} setVisible={setCalendarModal}>
          <Calendar />
        </Modal>
        <CustomIcon><FontAwesomeIcon icon={faMapLocationDot} onClick={handleMapOpen}/></CustomIcon>
        <Modal visible={mapModal} setVisible={setMapModal}>
          <MapComp readyToRender={readyToRender}/>
        </Modal>
        <Search qty={1} placeholder={'user'} handleSearch={handleSearch} setSearchValue={setSearchValue} searchValue={searchValue}/>
        
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
