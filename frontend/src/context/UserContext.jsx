import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import UserService from '../API/UserService'
import FriendService from '../API/FriendService'
import AuthContext from './AuthContext'
import EventService from '../API/EventService'
import MailService from '../API/MailService'
import { faGraduationCap, faPlusSquare, faUtensils, faWineGlass, faMountainSun, faBaseballBatBall, faSnowman, faBriefcase, faCar, faBagShopping, faMugHot } from '@fortawesome/free-solid-svg-icons'
import Alert from '../components/UI/Alert/Alert'


const UserContext = createContext(null)


export const UserProvider = ({children}) => {
    const {isAuth} = useContext(AuthContext)
    const [isMobile, setIsMobile] = useState(false)
    const [thisUser, setThisUser] = useState(null)
    const [friends, setFriends] = useState([])
    const [sentFriendRequests, setSentFriendRequests] = useState([])
    const [receivedFriendRequests, setReceivedFriendRequests] = useState([])
    const [sentEvents, setSentEvents] = useState([])
    const [receivedEvents, setReceivedEvents] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [emailQty, setEmailQty] = useState(null)
    const [alertResponse, setAlertResponse] = useState({status: null, text: null})
    const [eventsQty, setEventsQty] = useState([])
    const [eventCategories, setEventCategories] = useState([
      {name: 'Health', value: 'HEALTH', qty: 0, icon: faPlusSquare, className: 'health'},
      {name: 'Education', value: 'EDUCATION', qty: 0, icon: faGraduationCap, className: 'education'},
      {name: 'Dinner', value: 'DINNER', qty: 0, icon: faMugHot, className: 'dinner'},
      {name: 'Bar', value: 'BAR', qty: 0, icon: faWineGlass, className: 'bar'},
      {name: 'Leisure', value: 'LEISURE', qty: 0, icon: faBaseballBatBall, className: 'leisure'},
      {name: 'Relaxation', value: 'RELAXATION', qty: 0, icon: faMountainSun, className: 'relaxation'},
      {name: 'Holiday', value: 'HOLIDAY', qty: 0, icon: faSnowman, className: 'holiday'},
      {name: 'Work', value: 'WORK', qty: 0, icon: faBriefcase, className: 'work'},
      {name: 'Travel', value: 'TRAVEL', qty: 0, icon: faCar, className: 'travel'},
      {name: 'Shoping', value: 'SHOPING', qty: 0, icon: faBagShopping, className: 'shoping'}
    ])
    

    useEffect(() => {

      setIsLoading(true)
      const username = localStorage.getItem('username')
      if (username && isAuth){
        const fetchData = async () => {
          const userData = await UserService.getUser(username) // ? set to localStorage?
          const friendsData = await FriendService.getFriends(username)
          const email_qty = await MailService.getEmailQty() // change to unread mail
          const eventsQty = await EventService.getEventsQty()
          const sent_friend_requests = await FriendService.getSentRequests(username)
          const received_friend_requests = await FriendService.getReceivedRequests(username)

          setThisUser(userData.data)
          setFriends([...friendsData])
          setEmailQty(email_qty)
          setEventsQty([...eventsQty])
          setSentFriendRequests([...sent_friend_requests])
          setReceivedFriendRequests([...received_friend_requests])
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

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    setIsMobile(mql.matches)
    
    window.onresize = () => {
      setIsMobile(mql.matches)
    }
  }, [])
 

    const context = {
        alertResponse,
        setAlertResponse,
        eventCategories,
        setEventCategories,
        eventsQty,
        setEventsQty,
        emailQty,
        setEmailQty,
        receivedEvents,
        setReceivedEvents,
        sentEvents,
        setSentEvents,
        isLoading,
        setIsLoading,
        thisUser,
        setThisUser,
        friends,
        setFriends,
        sentFriendRequests,
        setSentFriendRequests,
        receivedFriendRequests,
        setReceivedFriendRequests,
        isMobile
    }

  return (
    <UserContext.Provider value={context}>
      {alertResponse.status !== null && <Alert alert={alertResponse} setAlert={setAlertResponse}/>}
        {children}
    </UserContext.Provider>
  )
}

export default UserContext