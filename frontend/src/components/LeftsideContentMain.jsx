import React, { useContext } from 'react'
import classes from './styles/LeftsideContentMain.module.css'
import { Link, useNavigate } from 'react-router-dom'
import UserContext from '../context/UserContext'
import CustomIcon from './UI/CustomIcon/CustomIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowRight, faEnvelopeOpen, faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons'

const LeftsideContentMain = ({friends, randomFriends}) => {
    const {emailQty} = useContext(UserContext)
    const navigate = useNavigate()
  
    const handleClickFriend = (username) => {
      navigate('/map', {state: {action: 'selectUser', username: username}})
    }
  
    return (
        <div className={classes.container}>
          <div className={classes.mail}>
            <div className={classes.mailHeader}>{emailQty === 0 ? <>Mail is empty</> : <>Check your mail</> }</div>
            <div className={classes.mailImage}>
              {emailQty === 0
              ?<Link to='/mail'><FontAwesomeIcon icon={faEnvelopeOpen} /></Link>
              :<Link to='/mail'><FontAwesomeIcon icon={faEnvelopeOpenText} /></Link>
              }
            </div>
          </div>
          <div className={classes.inviteFriendsContainer}>
            <div className={classes.friendsHeading}>
              Meet your friends
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
    )
}

export default LeftsideContentMain