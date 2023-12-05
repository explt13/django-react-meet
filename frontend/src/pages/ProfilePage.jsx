import React, { useContext } from 'react'
import Navbar from '../components/UI/Navbar/Navbar'
import UserContext from '../context/UserContext'
import ProfileInformation from '../components/ProfileInformation'

const ProfilePage = () => {
  return (
    <div className='container'>
      <ProfileInformation />
    </div>
  )
}

export default ProfilePage