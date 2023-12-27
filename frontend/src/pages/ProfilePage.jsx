import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/UI/Navbar/Navbar'
import UserContext from '../context/UserContext'
import ProfileInformation from '../components/ProfileInformation'
import Loader from '../components/UI/Loader/Loader'
import { useParams } from 'react-router-dom'
import UserService from '../API/UserService'
import classes from './styles/ProfilePage.module.css'

const ProfilePage = () => {
  const {isLoading, setIsLoading} = useContext(UserContext)
  

  return (
    isLoading
    ? <Loader />
    :
    <div className='container wrapper'>
      <div className={classes.profileContainer}>
        <ProfileInformation/>
      </div>
      
    </div>
  )
}

export default ProfilePage