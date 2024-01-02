import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../context/UserContext'
import classes from './styles/ProfileInformation.module.css'
import { Link, useParams } from 'react-router-dom'
import FriendService from '../API/FriendService'
import Loader from './UI/Loader/Loader'
import CustomButton from './UI/CustomButton/CustomButton'
import AuthContext from '../context/AuthContext'
import UserService from '../API/UserService'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'


const ProfileInformation = ({user}) => {
    const {thisUser, setAlertResponse, friends, sentFriendRequests, setSentFriendRequests} = useContext(UserContext)
    const { csrftoken } = useContext(AuthContext)

    const handleAddFriend = async () => {
        
        const response = await FriendService.sendFriendRequest(user.username, csrftoken)
        setSentFriendRequests(prevRequests => [...prevRequests, {username: user.username}])
        setAlertResponse({status: response.status, text: response.data})
    }

    const isThisUser = thisUser.username === user.username
    const isPending = sentFriendRequests.find(friend => friend.username === user.username)
    const isFriend = friends.find(friend => friend.username === user.username)
    
    return (
        <div className={classes.profileInformationContainer}>
            <div className={classes.mainInformation}>
                <div className={classes.imgContainer}><img src={`http://127.0.0.1:8000/${user.profile_pic}`}></img></div>
                <div className={classes.userInformation}>
                    <div className={classes.fullName}>
                        <div>{user.first_name}</div>
                        <div>{user.last_name}</div>
                    </div>
                    <div className={classes.userUsername}>{user.username}</div>
                    {user.about &&
                    <div className={classes.userAbout}>About: <div>{user.about}</div></div>
                    }
                </div>
            </div>
            <div className={classes.options}>
                {isThisUser && <Link to={`/user/${thisUser.username}/edit`}>Edit profile</Link>}
                {isPending && <div className={classes.pending}>pending</div>}
                {isFriend && <div className={classes.alreadyFriends}>friends <FontAwesomeIcon icon={faCheck}/></div>}
                {!isThisUser && !isPending && !isFriend &&
                <CustomButton className={classes.addFriend} onClick={handleAddFriend}>Add friend</CustomButton>
                }
            </div>
        </div>
 
        /* {thisUser.username !== user.username && !friends.find(friend => friend.username === user.username) && <CustomButton onClick={handleAddFriend}>send friend request</CustomButton>} */

    )
}

export default ProfileInformation