import React, { useContext, useEffect, useState } from 'react'
import UsersList from '../components/UsersList'
import UserService from '../API/UserService'
import { useLocation } from 'react-router-dom'
import FriendService from '../API/FriendService'
import AuthContext from '../context/AuthContext'
import UserContext from '../context/UserContext'



const SearchPage = () => { 
  const [error, setError] = useState(null)
  const [resultList, setResultList] = useState([])
  const {csrftoken} = useContext(AuthContext)
  const {setSentFriendRequests, setAlertResponse, sentFriendRequests, friends} = useContext(UserContext)
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const username = searchParams.get('username')
  
  useEffect(() => {
    const search = async () => {
      try{
        const data = await UserService.searchUsers(username)
        setResultList([...data])
        setError(null)
      } catch (e){
        setError(e.response.data)
        setResultList([])
      }
      
    }  

    search()
  }, [username])

  const addFriend = async (username) => {
    const response = await FriendService.sendFriendRequest(username, csrftoken)
    setSentFriendRequests(prevRequests => [...prevRequests, response.data.user])
    setAlertResponse({status: response.status, text: response.data.alert})
  }
  
  return (
    <div className='container wrapper'>
      <div>{error ? 'No users found' : `Results for searching users: ${username}`}</div>
      <UsersList resultList={resultList} forSearch={'true'} addFriend={addFriend} sentFriendRequests={sentFriendRequests} friends={friends}/> 
    </div>
  )
}

export default SearchPage