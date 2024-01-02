import React, { useContext, useEffect, useState } from 'react'
import classes from './styles/SidebarContent.module.css'
import UserService from '../API/UserService'
import AuthContext from '../context/AuthContext'
import UserContext from '../context/UserContext'
import CustomButton from './UI/CustomButton/CustomButton'
import { Link } from 'react-router-dom'
import Loader from './UI/Loader/Loader'
import { faArrowRightFromBracket, faEnvelope, faIcons, faUser, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const SidebarContent = ({handleClose}) => {
    const {isAuth, setIsAuth, csrftoken} = useContext(AuthContext)
    const {thisUser, setThisUser, isLoading, setAlertResponse} = useContext(UserContext)

    const logout = async () => {
        try {
          const response = await UserService.logoutUser(csrftoken)
          setIsAuth(false)
          setAlertResponse({status: response.status, text: response.data})
          
        } catch (e) {
          console.log(e)
        }
    }
    console.log(thisUser)
    return (
      isLoading || !thisUser
      ? <Loader />
      :
        <div className={classes.content}>

            <div onClick={handleClose} className={[classes.contentItem, classes.username].join(' ')}><Link to={`/user/${thisUser.username}`} className={classes.link}>Profile  <FontAwesomeIcon icon={faUser} /></Link></div>
            <div onClick={handleClose} className={classes.contentItem}><Link to={`/user/${thisUser.username}/friends`} className={classes.link}>Friends  <FontAwesomeIcon icon={faUserGroup} /></Link></div>
            <div onClick={handleClose} className={classes.contentItem}><Link to={`/mail`} className={classes.link}>Mail  <FontAwesomeIcon icon={faEnvelope} /></Link></div>
            <div onClick={handleClose} className={classes.contentItem}><Link to={`/categories`} className={classes.link}>Categories  <FontAwesomeIcon icon={faIcons} /></Link></div>
            <div className={[classes.contentItem, classes.logout].join(' ')} onClick={logout}>Log out  <FontAwesomeIcon icon={faArrowRightFromBracket} /></div>
        </div>

  )
}

export default SidebarContent