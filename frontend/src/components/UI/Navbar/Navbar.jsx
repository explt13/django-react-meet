import React, { useContext, useState } from 'react'
import CustomButton from '../CustomButton/CustomButton'
import classes from './Navbar.module.css'

import UserContext from '../../../context/UserContext'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCalendar, faMapLocationDot, faBars, faHouse, faSearch, faTimes, faEnvelope, faCalendarDays } from '@fortawesome/free-solid-svg-icons'

import CustomIcon from '../CustomIcon/CustomIcon'
import Sidebar from '../Sidebar/Sidebar'
import SidebarContent from '../../SidebarContent'
import { Link, useNavigate } from 'react-router-dom'

import Search from '../Search/Search'



const Navbar = () => {
  const { emailQty } = useContext(UserContext)
  const [sidebar, setSidebar] = useState(false)
  const [calendarModal, setCalendarModal] = useState(false)
  const [searchValue, setSearchValue] = useState('')


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
        <Link to='/calendar'><CustomIcon><FontAwesomeIcon icon={faCalendarDays} /></CustomIcon></Link>
        <Link to='/map'><CustomIcon><FontAwesomeIcon icon={faMapLocationDot}/></CustomIcon></Link>
        <div className={classes.mailIcon}>
          <Link to='/mail'><CustomIcon><FontAwesomeIcon icon={faEnvelope} /></CustomIcon></Link>
          {emailQty > 0&& <span>*</span>}
        </div>
        <Search qty={1} placeholder={'user'} handleSearch={handleSearch} setSearchValue={setSearchValue} searchValue={searchValue}/>
        
      </div>

      <div className={classes.rightSide}>
        <CustomIcon className={classes.barsIcon}><FontAwesomeIcon icon={faBars} onClick={() => setSidebar(true)}/></CustomIcon>
        <Sidebar visible={sidebar} setVisible={setSidebar}>
          <SidebarContent setSidebarVisible={setSidebar}/>
        </Sidebar>
      </div>
    </div>
  )
}

export default Navbar
