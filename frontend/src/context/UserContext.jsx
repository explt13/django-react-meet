import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import UserService from '../API/UserService'
import FriendService from '../API/FriendService'
import AuthContext from './AuthContext'
import EventService from '../API/EventService'

const UserContext = createContext(null)


export const UserProvider = ({children}) => {// otherwise props.children
    const {isAuth} = useContext(AuthContext)
    const [thisUser, setThisUser] = useState(null)
    const [friends, setFriends] = useState(null)
    const [events, setEvents] = useState([])
    const [sentEvents, setSentEvents] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [acceptedEvents, setAcceptedEvents] = useState([])
    

    useEffect(() => {
      setIsLoading(true)
      const username = localStorage.getItem('username')
      console.log('1')
      if (username && isAuth){
        const fetchData = async () => {
          const userData = await UserService.getUser(username) // ? set to localStorage?
          setThisUser(userData)

          const friendsData = await FriendService.getFriends(username)
          setFriends([...friendsData])

          const sent_events = await EventService.getSentEvents()
          const recieved_events = await EventService.getRecievedEvents()
          const accepted_events = await EventService.getAcceptedEvents()
          setEvents([...sent_events, ...recieved_events])
          setSentEvents([...sent_events])
          setAcceptedEvents(accepted_events)

          setIsLoading(false)
        }
        fetchData()
      }
  
    }, [isAuth])
  

    const context = {
        acceptedEvents,
        isLoading,
        setIsLoading,
        thisUser,
        setThisUser,
        friends,
        setFriends,
        events,
        setEvents,
        sentEvents
    }


  return (
    <UserContext.Provider value={context}>
        {children}
    </UserContext.Provider>
  )
}

export default UserContext