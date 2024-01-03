import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../context/UserContext'
import ProfileInformation from '../components/ProfileInformation'
import Loader from '../components/UI/Loader/Loader'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import UserService from '../API/UserService'
import classes from './styles/ProfilePage.module.css'
import Interests from './../components/Interests'

const ProfilePage = () => {
  const {isLoading, thisUser} = useContext(UserContext)
  const params = useParams()
  const [user, setUser] = useState(null)
  const navigate = useNavigate()


  useEffect(() => {
    const getUser = async () => {
        const response = await UserService.getUser(params.username)
        if (response.status === 200){
          setUser(response.data)
        }
        if (response.status === 404){
          navigate('error') 
        }
    }
    getUser()  
  }, [params.username])


  return (
    isLoading || !user
    ? <Loader />
    :
    <div className='container wrapper'>
      
      <div className={classes.profileContainer}>
        <ProfileInformation user={user}/>
      </div>
      
      <Interests user={user}/>
      
    </div>
  )
}

export default ProfilePage