import React, { useContext } from 'react'
import classes from './../styles/SidebarContent.module.css'
import UserService from '../API/UserService'
import AuthContext from '../context/AuthContext'
import UserContext from '../context/UserContext'
import CustomButton from './UI/CustomButton/CustomButton'

const SidebarContent = () => {
    const {isAuth, setIsAuth, csrftoken} = useContext(AuthContext)
    const {userInformation, setUserInformation} = useContext(UserContext)
    const logout = async () => {
        try {
          await UserService.logoutUser(csrftoken)
          setIsAuth(false)
          
        } catch (e) {
          console.log(e)
        }
    }
    return (
        <div className={classes.content}>
            <div className={classes.contentItem}>{userInformation.username}</div>
            <div className={classes.contentItem}><CustomButton onClick={logout}>Log out</CustomButton></div>
            
        </div>
  )
}

export default SidebarContent