import React, { useContext, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react'
import FriendsContent from '../components/FriendsContent'
import UserContext from '../context/UserContext'
import classes from './styles/FriendsPage.module.css'
import Loader from '../components/UI/Loader/Loader'
import CustomButton from '../components/UI/CustomButton/CustomButton'
import { useParams } from 'react-router-dom'
import FriendService from '../API/FriendService'
import FriendsPageNavigate from '../components/FriendsPageNavigate'
import CustomIcon from './../components/UI/CustomIcon/CustomIcon'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const FriendsPage = () => {
  const {isLoading} = useContext(UserContext)
  const [tab, setTab] = useState('friends')
  
  useLayoutEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)")
    const heading = document.getElementById('heading')
    
    if (mql.matches && heading){
      heading.onclick = showNavigation
    }
  }, [isLoading])

  const showNavigation = (ev) => {
    ev.stopPropagation()
    const navigation = document.getElementById('navigation') // could've done using state classes
    const icon = document.getElementById('navigateicon')
    if (navigation.classList.contains(classes.showNavigationMobile)){
      navigation.classList.add(classes.closeNavigationMobile)
      icon.classList.remove(classes.opened)
      setTimeout(() => {
        navigation.classList.remove(classes.showNavigationMobile)
        navigation.classList.remove(classes.closeNavigationMobile)
        
      }, 200)
      
    } else {
      icon.classList.add(classes.opened)
      navigation.classList.add(classes.showNavigationMobile)
    }
  }

  useEffect(() => {
    document.title = 'Friends'
  }, [])

  return (
    isLoading
    ? <Loader />
    :
    <div className='container contentWrapper'>
      <div className={classes.container}>

        <div className={classes.heading}>
          <span id='heading' >
          {tab === 'friends' && 'All Friends'}
          {tab === 'sent' && 'Sent Requests'}
          {tab === 'received' && 'Received requests'}
          </span>
          <CustomIcon id='navigateicon' className={classes.navigateIcon} onClick={showNavigation}><FontAwesomeIcon icon={faAngleDown} /></CustomIcon>
        </div>
        <div className={classes.contentContainer}>
          <div  id='navigation' className={classes.navigate}>
            <div className={classes.navigateHeader}>Navigate</div>
            <CustomButton className={classes.navigateItem} onClick={() => setTab('friends')}>All friends</CustomButton>
            <CustomButton className={classes.navigateItem} onClick={() => setTab('sent')}>Sent requests</CustomButton>
            <CustomButton className={classes.navigateItem} onClick={() => setTab('received')}>Received requests</CustomButton>
          </div>
          <FriendsContent tab={tab}/>

        </div>
        
      </div>
    </div>
  )
}

export default FriendsPage