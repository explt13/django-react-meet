import React, { useContext, useEffect, useState } from 'react'
import classes from './styles/SidebarContent.module.css'
import UserService from '../API/UserService'
import AuthContext from '../context/AuthContext'
import UserContext from '../context/UserContext'
import CustomButton from './UI/CustomButton/CustomButton'
import { Link } from 'react-router-dom'
import Loader from './UI/Loader/Loader'
import { faArrowRightFromBracket, faBoxArchive, faEnvelope, faIcons, faUser, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import CustomIcon from './UI/CustomIcon/CustomIcon'

const SidebarContent = ({handleClose}) => {
    const {isAuth, setIsAuth, csrftoken} = useContext(AuthContext)
    const {thisUser, setThisUser, isLoading, setAlertResponse} = useContext(UserContext)

    const logout = async () => {
        try {
          const response = await UserService.logoutUser(csrftoken)
          setIsAuth(false)
          setAlertResponse({status: response.status, text: response.data})
          
        } catch (e) {

        }
    }
    return (
      isLoading || !thisUser
      ? <Loader />
      :
        <div className={classes.content}>

            <div onClick={handleClose} className={[classes.contentItem, classes.username].join(' ')}><Link to={`/user/${thisUser.username}`} className={classes.link}>Profile  <CustomIcon className={classes.icon} ><FontAwesomeIcon icon={faUser} /></CustomIcon></Link></div>
            <div onClick={handleClose} className={classes.contentItem}><Link to={`/user/${thisUser.username}/friends`} className={classes.link}>Friends  <CustomIcon className={classes.icon} ><FontAwesomeIcon icon={faUserGroup} /></CustomIcon></Link></div>
            <div onClick={handleClose} className={classes.contentItem}><Link to={`/categories`} className={classes.link}>Categories  <CustomIcon className={classes.icon} ><FontAwesomeIcon icon={faIcons} /></CustomIcon></Link></div>
            <div onClick={handleClose} className={classes.contentItem}><Link to={`/archive`} className={classes.link}>Archive  <CustomIcon className={classes.icon}> <FontAwesomeIcon icon={faBoxArchive} /></CustomIcon></Link></div>
            <div className={[classes.contentItem, classes.logout].join(' ')} onClick={logout}>Log out  <CustomIcon className={classes.icon} ><FontAwesomeIcon icon={faArrowRightFromBracket} /></CustomIcon></div>
        </div>

  )
}

export default SidebarContent