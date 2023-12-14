import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import UserService from '../API/UserService'
import FriendService from '../API/FriendService'
import AuthContext from './AuthContext'

const UserContext = createContext(null)


export const UserProvider = ({children}) => {// otherwise props.children
    const {isAuth} = useContext(AuthContext)
    const [thisUser, setThisUser] = useState(null)
    const [friends, setFriends] = useState(null)

    useEffect(() => {
      const username = localStorage.getItem('username')
      if (username && isAuth){
        const fetchData = async () => {
          const userData = await UserService.getUser(username) // ? set to localStorage?
          setThisUser(userData)

          const friendsData = await FriendService.getFriends(username)
          setFriends([...friendsData])
        }
        fetchData()
      }
  
    }, [isAuth])
  

    const context = {
        thisUser,
        setThisUser,
        friends,
        setFriends
    }


  return (
    <UserContext.Provider value={context}>
        {children}
    </UserContext.Provider>
  )
}

export default UserContext