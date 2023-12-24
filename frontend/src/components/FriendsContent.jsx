import React, { useContext, useEffect, useMemo, useState } from 'react'
import classes from './styles/FriendsContent.module.css'
import FriendService from '../API/FriendService'
import { Link, useParams } from 'react-router-dom'
import Loader from './UI/Loader/Loader'
import UsersList from './UsersList'
import CustomButton from './UI/CustomButton/CustomButton'
import UserContext from '../context/UserContext'
import AuthContext from '../context/AuthContext'

const FriendsContent = ({tab, resultList, setResultList}) => {
  const {csrftoken} = useContext(AuthContext)
  const {thisUser} = useContext(UserContext)


  const handleAccept = async (friendshipID) => {
    await FriendService.acceptFriend(thisUser.username, friendshipID, csrftoken)
    setResultList(resultList.filter(friend => friend.friendship_id !== friendshipID))
  }

  const handleReject = async (friendshipID) => {
    await FriendService.rejectFriend(thisUser.username, friendshipID, csrftoken)
    setResultList(resultList.filter(friend => friend.friendship_id !== friendshipID))
  }

  const handleDelete = async (deleteUsername) => {
    await FriendService.deleteFriend(thisUser.username, deleteUsername, csrftoken)
    setResultList(resultList.filter(friend => friend.username !== deleteUsername))
  }


  return (
    
    <div className={classes.container}>
      <div className={classes.searchInformation}>{resultList.length === 0 && 'Seems empty..'}</div>
      <UsersList tab={tab} resultList={resultList} handleAccept={handleAccept} handleReject={handleReject} handleDelete={handleDelete}/>
    </div>
  )
}

export default FriendsContent