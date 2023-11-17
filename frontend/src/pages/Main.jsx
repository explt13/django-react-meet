import React, { useContext, useEffect } from 'react'
import Calendar from '../components/Calendar'
import Navbar from '../components/UI/Navbar/Navbar'
import UserContext from '../context/UserContext'
import Map from '../components/Map'

const Main = () => {
  const {userInformation, setUserInformation} = useContext(UserContext)
  
  useEffect(() => {
    setUserInformation(JSON.parse(localStorage.getItem('user')))
  }, [])


  return (
    <div>
      <Navbar />

    </div>
  )
}

export default Main