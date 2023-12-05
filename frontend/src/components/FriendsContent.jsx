import React, { useContext, useEffect, useMemo, useState } from 'react'
import classes from './styles/FriendsContent.module.css'
import UserService from '../API/UserService'
import { Link, useParams } from 'react-router-dom'
import Loader from './UI/Loader/Loader'
import UsersList from './UsersList'
import CustomButton from './UI/CustomButton/CustomButton'
import UserContext from '../context/UserContext'
import AuthContext from '../context/AuthContext'

const FriendsContent = () => {
  const {csrftoken} = useContext(AuthContext)
  const params = useParams()
  const [resultList, setResultList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const [tab, setTab] = useState(null)
  const {thisUser, setThisUser, friends, setFriends} = useContext(UserContext)

  useEffect(() => {
    setResultList(friends)
    setTab('friends')
  }, [friends])


  const fetchData = async (fetchFunction) => {
    setIsLoading(true)
    try{
      const data = await fetchFunction();
      setResultList(data)
      console.log(data)
    } catch (e) {
      setError(e.response.data)
    } finally {
      setIsLoading(false)
    }
  }




  const fetchAllFriends = useMemo(() => () => UserService.getFriends(params.username), [params.username])
  const fetchSentRequests = useMemo(() => () => UserService.getSentRequests(params.username), [params.username])
  const fetchReciviedRequests = useMemo(() => () => UserService.getRecievedRequests(params.username), [params.username])

  const handleAllFriends = async () => {
    fetchData(fetchAllFriends)
    setTab('friends')
  }
  const handleSentRequests = () => {
    fetchData(fetchSentRequests)
    setTab('requested')
  }

  const handleRecievedRequests = async () => {
    fetchData(fetchReciviedRequests)
    setTab('recieved')
  }

  const handleAccept = async (friendshipID) => {
    await UserService.acceptFriend(thisUser.username, friendshipID, csrftoken)
    setResultList(resultList.filter(friend => friend.friendship_id !== friendshipID))
  }

  const handleReject = async (friendshipID) => {
    await UserService.rejectFriend(thisUser.username, friendshipID, csrftoken)
    setResultList(resultList.filter(friend => friend.friendship_id !== friendshipID))
  }

  const handleDelete = async (deleteUsername) => {
    await UserService.deleteFriend(thisUser.username, deleteUsername, csrftoken)
    setResultList(resultList.filter(friend => friend.username !== deleteUsername))
  }


  return (
    <div className={[classes.wrapper, classes.container].join(' ')}>
        <div className={classes.navigate}>
          <div>
            <CustomButton className={classes.navigateItem} onClick={handleAllFriends}>All friends</CustomButton>
            <CustomButton className={classes.navigateItem} onClick={handleSentRequests}>Sent requests</CustomButton>
            <CustomButton className={classes.navigateItem} onClick={handleRecievedRequests}>Recieved requests</CustomButton>
            </div>
        </div>
        {isLoading || !resultList
        ? <Loader />
        :
        <div className={classes.content}>
          <div className={classes.searchInformation}>{resultList.length === 0 && 'Seems empty..'}</div>
          <UsersList tab={tab} resultList={resultList} handleAccept={handleAccept} handleReject={handleReject} handleDelete={handleDelete}/>
        </div>
        }
    </div>
  )
}

export default FriendsContent