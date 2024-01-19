import React, { useContext, useEffect, useMemo, useState } from 'react'
import classes from './styles/FriendsContent.module.css'
import FriendService from '../API/FriendService'
import { Link, useParams } from 'react-router-dom'
import Loader from './UI/Loader/Loader'
import UsersList from './UsersList'
import CustomButton from './UI/CustomButton/CustomButton'
import UserContext from '../context/UserContext'
import AuthContext from '../context/AuthContext'
import NoResult from './UI/NoResult/NoResult'
import { faPaperPlane, faUserGroup, faFaceSadTear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const FriendsContent = ({tab}) => {
  const {csrftoken} = useContext(AuthContext)
  const {thisUser, setAlertResponse, setFriends, friends, setSentFriendRequests, sentFriendRequests, receivedFriendRequests, setReceivedFriendRequests} = useContext(UserContext)
  const [resultList, setResultList] = useState([])
  
  useEffect(() => {
    if (tab === 'friends'){
      setResultList([...friends])
    }
    if (tab === 'sent'){
      setResultList([...sentFriendRequests])
    }
    if (tab === 'received'){
      setResultList([...receivedFriendRequests])
    }
  }, [tab])



  const handleDelete = async (deleteUsername) => {
    const response = await FriendService.deleteFriend(thisUser.username, deleteUsername, csrftoken)
    setFriends(friends.filter(friend => friend.username !== deleteUsername))
    setResultList(resultList.filter(friend => friend.username !== deleteUsername))
    setAlertResponse({status: response.status, text: response.data})
  }

  const handleCancel = async (friendshipID) => {
    const response = await FriendService.cancelFriend(thisUser.username, friendshipID, csrftoken)
    setSentFriendRequests(sentFriendRequests.filter(friend => friend.friendship_id !== friendshipID))
    setResultList(resultList.filter(friend => friend.friendship_id !== friendshipID))
    setAlertResponse({status: response.status, text: response.data})
  }


  const handleAccept = async (friendshipID) => {
    const response = await FriendService.acceptFriend(thisUser.username, friendshipID, csrftoken)
    setReceivedFriendRequests(receivedFriendRequests.filter(friend => friend.friendship_id !== friendshipID))
    setResultList(resultList.filter(friend => friend.friendship_id !== friendshipID))
    setFriends(prevFriends => [...prevFriends, response.data.user])
    setAlertResponse({status: response.status, text: response.data.alert})
  }

  const handleReject = async (friendshipID) => {
    const response = await FriendService.rejectFriend(thisUser.username, friendshipID, csrftoken)
    setReceivedFriendRequests(receivedFriendRequests.filter(friend => friend.friendship_id !== friendshipID))
    setResultList(resultList.filter(friend => friend.friendship_id !== friendshipID))
    setAlertResponse({status: response.status, text: response.data})
  }

  

  return (

    <div className={classes.container}>
      {resultList.length === 0
      ? tab === 'friends' ? <NoResult data={'You don\'t have any friends yet'} icon={<FontAwesomeIcon icon={faUserGroup} />} /> :<NoResult data={`No ${tab} requests`} icon={tab === 'received' ? <FontAwesomeIcon icon={faFaceSadTear} /> :<FontAwesomeIcon icon={faPaperPlane} />}/>
      : <UsersList forFriends={'true'} tab={tab} resultList={resultList} handleDelete={handleDelete} handleCancel={handleCancel} handleAccept={handleAccept} handleReject={handleReject}/>
      }
    </div>
  )
}

export default FriendsContent