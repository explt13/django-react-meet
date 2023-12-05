import React, { useEffect, useState } from 'react'
import UsersList from '../components/UsersList'
import UserService from '../API/UserService'
import { useLocation } from 'react-router-dom'



const SearchPage = () => { 
  const [error, setError] = useState(null)
  const [resultList, setResultList] = useState([])
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const username = searchParams.get('username')
  
  useEffect(() => {
    const search = async () => {
      try{
        const data = await UserService.searchUsers(username)// HARDCODED NEED TO IMPROVE

        setResultList([...data])
        setError(null)
      } catch (e){
        setError(e.response.data)
        setResultList([])
      }
      
    }  

    search()
  }, [username])
  
  return (
    <div className='container wrapper'>
      <div>{error ? 'No users found' : `Results for searching users: ${username}`}</div>
      <UsersList resultList={resultList}/> 
    </div>
  )
}

export default SearchPage