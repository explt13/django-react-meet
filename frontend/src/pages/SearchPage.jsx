import React, { useContext, useEffect, useState } from 'react'
import UsersList from '../components/UsersList'
import UserService from '../API/UserService'
import { useLocation } from 'react-router-dom'
import FriendService from '../API/FriendService'
import AuthContext from '../context/AuthContext'
import UserContext from '../context/UserContext'
import NoResult from '../components/UI/NoResult/NoResult'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFaceSadTear } from '@fortawesome/free-solid-svg-icons'



const SearchPage = () => { 
  const [error, setError] = useState(null)
  const [resultList, setResultList] = useState([])
  const {csrftoken} = useContext(AuthContext)
  const {setSentFriendRequests, setAlertResponse, sentFriendRequests, friends} = useContext(UserContext)
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const query = searchParams.get('query')
  
  useEffect(() => {
    document.title = `Search`
  }, [])

  useEffect(() => {
    
    const search = async () => {
      try{
        const data = await UserService.searchUsers(query)
        setResultList([...data])
        setError(null)
      } catch (e){
        setError(e.response.data)
        setResultList([])
      }
      
    }  

    search()
  }, [query])

  const addFriend = async (username) => {
    const response = await FriendService.sendFriendRequest(username, csrftoken)
    setSentFriendRequests(prevRequests => [...prevRequests, response.data.user])
    setAlertResponse({status: response.status, text: response.data.alert})
  }

  
  return (
    <div className='container contentWrapper'>
      {error ? <NoResult data={'No user found matching the query'} icon={<FontAwesomeIcon icon={faFaceSadTear}/>}/> : <div style={{fontSize: '20px', marginBottom: '10px'}}>Results for searching users: {query}</div>}
      <UsersList resultList={resultList} forSearch={'true'} addFriend={addFriend} sentFriendRequests={sentFriendRequests} friends={friends}/> 
    </div>
  )
}

export default SearchPage