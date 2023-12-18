import React, { useContext } from 'react'
import FriendsContent from '../components/FriendsContent'
import UserContext from '../context/UserContext'
import classes from './styles/FriendsPage.module.css'
import Loader from '../components/UI/Loader/Loader'

const FriendsPage = () => {
  const {isLoading} = useContext(UserContext)
  return (
    isLoading
    ? <Loader />
    :
    <div className='container wrapper'>
      <FriendsContent />
    </div>
  )
}

export default FriendsPage