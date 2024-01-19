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
    if (user){
      document.title = `Profile - ${user.first_name} ${user.last_name}`
    }
  }, [user])

  useEffect(() => {
    
    const getUser = async () => {
        const response = await UserService.getUser(params.username)
        if (response.status === 200){
          setUser(response.data)
        }
        if (response.status === 404){
          navigate('/not_found') 
        }
    }
    getUser()  
  }, [params.username])


  return (
    isLoading || !user
    ? <Loader />
    :
    <div className='container contentWrapper'>
      
      <div className={classes.profileContainer}>
        <ProfileInformation user={user}/>
      </div>
      <Interests user={user}/>
      
    </div>
  )
}

export default ProfilePage