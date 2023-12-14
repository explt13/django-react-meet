import React, { useContext, useEffect } from 'react'
import UserContext from '../context/UserContext'
import UserService from '../API/UserService'


const MainPage = () => {

  const {thisUser, setThisUser, friends, setFriends} = useContext(UserContext) // maybe set user here

  

  
  return (
    <div className='container wrapper'>
      MAIN PAGE
    </div>
  )
}

export default MainPage