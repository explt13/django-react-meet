import React, { useContext, useEffect, useMemo, useState } from 'react'
import FriendsContent from '../components/FriendsContent'
import UserContext from '../context/UserContext'
import classes from './styles/FriendsPage.module.css'
import Loader from '../components/UI/Loader/Loader'
import CustomButton from '../components/UI/CustomButton/CustomButton'
import { useParams } from 'react-router-dom'
import FriendService from '../API/FriendService'
import FriendsPageNavigate from '../components/FriendsPageNavigate'

const FriendsPage = () => {
  const {isLoading} = useContext(UserContext)
  const [tab, setTab] = useState('friends')



 

  return (
    isLoading
    ? <Loader />
    :
    <div className='container wrapper'>
      <div className={classes.container}>
        <div className={classes.heading}>
          {tab === 'friends' && 'All Friends'}
          {tab === 'sent' && 'Sent Requests'}
          {tab === 'recieved' && 'Recieved requests'}
        </div>
        <FriendsPageNavigate setTab={setTab}/>
        <FriendsContent tab={tab}/>
      </div>
    </div>
  )
}

export default FriendsPage