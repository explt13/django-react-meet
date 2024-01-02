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
  const {thisUser, setAlertResponse} = useContext(UserContext)
 


  const handleAccept = async (friendshipID) => {
    const response = await FriendService.acceptFriend(thisUser.username, friendshipID, csrftoken)
    setResultList(resultList.filter(friend => friend.friendship_id !== friendshipID))
    setAlertResponse({status: response.status, text: response.data})
  }

  const handleReject = async (friendshipID) => {
    const response = await FriendService.rejectFriend(thisUser.username, friendshipID, csrftoken)
    setResultList(resultList.filter(friend => friend.friendship_id !== friendshipID))
    setAlertResponse({status: response.status, text: response.data})
  }

  const handleCancel = async (friendshipID) => {
    const response = await FriendService.cancelFriend(thisUser.username, friendshipID, csrftoken)
    setResultList(resultList.filter(friend => friend.friendship_id !== friendshipID))
    setAlertResponse({status: response.status, text: response.data})
  }

  const handleDelete = async (deleteUsername) => {
    const response = await FriendService.deleteFriend(thisUser.username, deleteUsername, csrftoken)
    setResultList(resultList.filter(friend => friend.username !== deleteUsername))
    setAlertResponse({status: response.status, text: response.data})
  }

  

  return (
    
    <div className={classes.container}>
      <div className={classes.searchInformation}>{resultList.length === 0 && 'Seems empty..'}</div>
      <UsersList tab={tab} resultList={resultList} handleAccept={handleAccept} handleReject={handleReject} handleDelete={handleDelete} handleCancel={handleCancel}/>
    </div>
  )
}

export default FriendsContent