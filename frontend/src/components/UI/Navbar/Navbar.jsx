import React, { useContext, useEffect, useState } from 'react'
import classes from './Navbar.module.css'
import UserContext from '../../../context/UserContext'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCalendar, faMapLocationDot, faBars, faHouse, faSearch, faTimes, faEnvelope, faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import CustomIcon from '../CustomIcon/CustomIcon'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Search from '../Search/Search'



const Navbar = ({setSidebar}) => {
  const { emailQty } = useContext(UserContext)
  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()

  
  const handleSearch = async (e) => {
    if (e.key === 'Enter' || e.type === 'click'){
        navigate(`/search?query=${searchValue}`) // hardcoded as well need to improve
    }
  }

  useEffect(() => {
    let currentY = 0;
    window.addEventListener('scroll', () => {
      const navbar = document.getElementById('navbar')
      if (navbar){
        if (currentY < window.scrollY){
          navbar.classList.add(classes.hideNavbar)
        } else if (currentY > window.scrollY){
          navbar.classList.remove(classes.hideNavbar)
        }
        currentY = window.scrollY
      }

    })
  }, [])

  return (
    <div id='navbar' className={[classes.container, 'navbar'].join(' ')}>
      <div className={classes.leftSide}>
        <div className={classes.navbarItem}>
        <Link to='/'><CustomIcon><FontAwesomeIcon icon={faHouse} /></CustomIcon></Link>
        </div>
        <div className={classes.navbarItem}>
        <Link to='/map'><CustomIcon><FontAwesomeIcon icon={faMapLocationDot}/></CustomIcon></Link>
        </div>
        <div className={[classes.navbarItem, classes.mailIcon].join(' ')}>
          <Link to='/mail'><CustomIcon><FontAwesomeIcon icon={faEnvelope} /></CustomIcon></Link>
          {emailQty >  0&& <span>*</span>}
        </div>
        <div className={classes.navbarItem}>
          <Search qty={1} placeholder={'user'} handleSearch={handleSearch} setSearchValue={setSearchValue} searchValue={searchValue}/>
        </div>
      </div>

      <div className={classes.rightSide}>
        <div className={classes.navbarItem}>
          <CustomIcon className={classes.barsIcon}><FontAwesomeIcon icon={faBars} onClick={() => setSidebar(true)}/></CustomIcon>
        </div>
      </div>
    </div>
  )
}

export default Navbar
