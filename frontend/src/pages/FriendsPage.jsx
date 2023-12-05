import React, { useContext } from 'react'
import FriendsContent from '../components/FriendsContent'
import UserContext from '../context/UserContext'
import classes from './styles/FriendsPage.module.css'

const FriendsPage = () => {

  return (
    <div className='container'>
      <FriendsContent />
    </div>
  )
}

export default FriendsPage