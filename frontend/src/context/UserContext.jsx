import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import UserService from '../API/UserService'
import FriendService from '../API/FriendService'
import AuthContext from './AuthContext'
import EventService from '../API/EventService'
import MailService from '../API/MailService'
import { faGraduationCap, faPlusSquare, faUtensils, faWineGlass, faMountainSun, faBaseballBatBall } from '@fortawesome/free-solid-svg-icons'


const UserContext = createContext(null)


export const UserProvider = ({children}) => {// otherwise props.children
    const {isAuth} = useContext(AuthContext)
    const [thisUser, setThisUser] = useState(null)
    const [friends, setFriends] = useState(null)
    const [sentEvents, setSentEvents] = useState([])
    const [recievedEvents, setRecievedEvents] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [acceptedEvents, setAcceptedEvents] = useState([])
    const [emailQty, setEmailQty] = useState(null)
    const [eventsQty, setEventsQty] = useState([])
    const [eventCategories, setEventCategories] = useState([
      {name: 'Health', value: 'HEALTH', qty: 0, icon: faPlusSquare, className: 'health'},
      {name: 'Education', value: 'EDUCATION', qty: 0, icon: faGraduationCap, className: 'education'},
      {name: 'Dinner', value: 'DINNER', qty: 0, icon: faUtensils, className: 'dinner'},
      {name: 'Bar', value: 'BAR', qty: 0, icon: faWineGlass, className: 'bar'},
      {name: 'Leisure', value: 'LEISURE', qty: 0, icon: faBaseballBatBall, className: 'leisure'},
      {name: 'Relaxation', value: 'RELAXATION', qty: 0, icon: faMountainSun, className: 'relaxation'},
  ])
     


    useEffect(() => {
      setIsLoading(true)
      const username = localStorage.getItem('username')
      
      if (username && isAuth){
        const fetchData = async () => {
          const userData = await UserService.getUser(username) // ? set to localStorage?
          setThisUser(userData)

          const friendsData = await FriendService.getFriends(username)
          setFriends([...friendsData])

          const sent_events = await EventService.getSentEvents()
          const recieved_events = await EventService.getRecievedEvents()
          const accepted_events = await EventService.getAcceptedEvents()
          const emailQty = await MailService.getEmailQty() // change to unread mail
          const eventsQty = await EventService.getEventsQty()

          setEmailQty(emailQty)
          setSentEvents([...sent_events])
          setRecievedEvents([...recieved_events])
          setAcceptedEvents([...accepted_events])
          setEventsQty([...eventsQty])
          setIsLoading(false)
        }
        fetchData()
      }
  
    }, [isAuth])

    useEffect(() => {
      if (eventsQty.length > 0){
          setEventCategories(prevCategories => prevCategories.map(category =>{
              const existingCategory = eventsQty.find(c => c.name === category.name)
              return existingCategory ? {...existingCategory, value: category.value, icon: category.icon, className: category.className} : category
          }
          ))
      }

  }, [eventsQty])

    const context = {
        eventCategories,
        setEventCategories,
        eventsQty,
        setEventsQty,
        emailQty,
        setEmailQty,
        acceptedEvents,
        setAcceptedEvents,
        recievedEvents,
        setRecievedEvents,
        sentEvents,
        setSentEvents,
        isLoading,
        setIsLoading,
        thisUser,
        setThisUser,
        friends,
        setFriends,
    }


  return (
    <UserContext.Provider value={context}>
        {children}
    </UserContext.Provider>
  )
}

export default UserContext