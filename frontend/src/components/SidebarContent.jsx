import React, { useContext, useEffect, useState } from 'react'
import classes from './styles/SidebarContent.module.css'
import UserService from '../API/UserService'
import AuthContext from '../context/AuthContext'
import UserContext from '../context/UserContext'
import CustomButton from './UI/CustomButton/CustomButton'
import { Link } from 'react-router-dom'
import Loader from './UI/Loader/Loader'

const SidebarContent = () => {
    const {isAuth, setIsAuth, csrftoken} = useContext(AuthContext)
    const {thisUser, setThisUser, isLoading} = useContext(UserContext)

    const logout = async () => {
        try {
          await UserService.logoutUser(csrftoken)
          setIsAuth(false)
          
        } catch (e) {
          console.log(e)
        }
    }
    return (
      isLoading
      ? <Loader />
      :
        <div className={classes.content}>

            <div className={classes.contentItem}><Link to={`/user/${thisUser.username}`} className={classes.link}>{thisUser.username}</Link></div>
            <div className={classes.contentItem}><Link to={`/user/${thisUser.username}/friends`} className={classes.link}>Friends</Link></div>
            
            <div className={classes.contentItem}><CustomButton onClick={logout}>Log out</CustomButton></div>
        </div>

  )
}

export default SidebarContent