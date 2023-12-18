import React, { useContext, useEffect, useRef, useState } from 'react'
import UserContext from '../context/UserContext'
import UserService from '../API/UserService'
import mail from './../media/img/mailV2.png'
import college from './../media/img/college.jpg'
import classes from './styles/MainPage.module.css'
import { Link, Router, useNavigate } from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleArrowRight} from '@fortawesome/free-solid-svg-icons'
import CustomIcon from './../components/UI/CustomIcon/CustomIcon'
import { getRandomFriends } from '../utils/friendsUtil'
import useRandomFriends from '../hooks/useRandomFriends'
import Loader from '../components/UI/Loader/Loader'
import MailService from './../API/MailService'


const MainPage = () => {

  const {friends, isLoading, acceptedEvents, sentEvents} = useContext(UserContext) // maybe set user here
  const [emailQty, setEmailQty] = useState(null)
  // const randomFriends = getRandomFriends(friends, 5) // might it trigger when there is typing for example? => useMemo
  // console.log(window.innerWidth) for mobile responsive
  useEffect(() => {
    const getEmailQty = async () => {
      const response = await MailService.getEmailQty()
      setEmailQty(response)
    }
    getEmailQty()
  }, [])

  const randomFriends = useRandomFriends(friends, 5) //?
  const navigate = useNavigate()

  const handleClickFriend = (username) => {
    navigate('/map', {state: {username: username}})
  }
  console.log(sentEvents)
  return (
    isLoading || !randomFriends
    ? <Loader />
    :
    <div className='container wrapper'>
        <div className={classes.layout}>
          <div className={classes.leftside}>
            <div className={classes.imageContainer}>
              Check your mail<span className={classes.emailQty}>{emailQty}</span>
              <Link to='/mail'><img src={mail} className={classes.mailImage}></img></Link>
            </div>
            <div className={classes.inviteFriendsContainer}>
              <div className={classes.friendsHeading}>
                Invite friends for a walk
              </div>
              <div className={classes.friendsList}>
                { randomFriends &&
                randomFriends.map(friend => (
                  <div key={friend.username} className={classes.friendContainer}>
                    <img title={friend.username} className={classes.friendImage} onClick={() => handleClickFriend(friend.username)} src={`http://127.0.0.1:8000/${friend.profile_pic}`}></img>
                  </div>
                ))
                }
                {friends.length > 5 && <div className={classes.friendsListMore}>...</div>}
              </div>
              <div className={classes.friendsOption}>
                Or go to map..
                <Link to='/map'><CustomIcon className={classes.arrow}><FontAwesomeIcon icon={faCircleArrowRight} /></CustomIcon></Link>
              </div>
            </div>
          </div>
        
          <div className={classes.mainContentContainer}>
            <div className={classes.eventsContainer}>
              <div className={classes.eventsHeading}>
                Upcoming events
              </div>
              
              
              {acceptedEvents.length > 0 
              ?
              <div className={classes.events}>
                {acceptedEvents.slice(acceptedEvents.length - 5, acceptedEvents.length).reverse().map(ev => (
                  <div className={classes.event} key={ev.event_id}>
                    <div>{ev.requester_username}</div>
                    <div>{ev.time}</div>
                    <div>{ev.text}</div>
                  </div>
                ))}
                <div className={classes.moreEvents}>
                  explore more..
                  <Link to='/map'><CustomIcon className={classes.arrow}><FontAwesomeIcon icon={faCircleArrowRight} /></CustomIcon></Link>
                </div>
              </div>
              :
              <div className={classes.noEvents}>
                <div>No upcoming events</div>
              </div>
              } 
            </div>
            

            <div className={classes.eventsContainer}>
              <div className={classes.eventsHeading}>
                Your recent activity
              </div>
              {sentEvents.length > 0 
              ?
              <div className={classes.events}>
                {sentEvents.slice(sentEvents.length - 5, sentEvents.length).map(ev => (
                  <div className={classes.event} key={ev.event_id}>
                    <div>to: {ev.recipients.map(recipient => <span key={recipient.username}>{recipient.username}</span>)}</div>
                    <div>{ev.time}</div>
                    <div>{ev.text}</div>
                  </div>
                ))}
              </div>
              :
              <div className={classes.noEvents}>
                <div>No upcoming events</div>
              </div>
              } 
            </div>
          </div>
        </div>
    </div>
  )
}

export default MainPage