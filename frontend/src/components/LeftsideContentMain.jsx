import React, { useContext } from 'react'
import classes from './styles/LeftsideContentMain.module.css'
import { Link, useNavigate } from 'react-router-dom'
import UserContext from '../context/UserContext'
import mail from './../media/img/mailV2.png'
import CustomIcon from './UI/CustomIcon/CustomIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons'

const LeftsideContentMain = ({friends, randomFriends}) => {
    const {emailQty} = useContext(UserContext)
    const navigate = useNavigate()
  
    const handleClickFriend = (username) => {
      navigate('/map', {state: {action: 'selectUser', username: username}})
    }
  
    return (
        <div className={classes.container}>
            <div className={classes.imageContainer}>
              Check your mail{emailQty > 0 && <span className={classes.emailQty}>{emailQty}</span>}
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
    )
}

export default LeftsideContentMain