import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../context/UserContext'
import classes from './styles/ProfileInformation.module.css'
import { Link, useParams } from 'react-router-dom'
import FriendService from '../API/FriendService'
import Loader from './UI/Loader/Loader'
import CustomButton from './UI/CustomButton/CustomButton'
import AuthContext from '../context/AuthContext'
import UserService from '../API/UserService'

const ProfileInformation = () => {
    const {thisUser, setThisUser, friends} = useContext(UserContext)
    const { csrftoken } = useContext(AuthContext)
    const [user, setUser] = useState(null)
    const [isUserLoading, setIsUserLoading] = useState(false)
    const params = useParams()


    useEffect(() => {
        setIsUserLoading(true)
        const getUser = async () => {
            const user = await UserService.getUser(params.username)
            setUser(user)
            setIsUserLoading(false)
        }
        getUser()
        
    }, [params.username])
    

    const handleAddFriend = async () => {
        const data = await FriendService.sendFriendRequest(user.username, csrftoken)
        console.log(data)
    }
    console.log(user)
    return (
        (isUserLoading || !user)
        ? <Loader />
        :
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
            <div className={classes.editProfile}>
                <Link to={`/user/${thisUser.username}/edit`}>Edit profile</Link>
            </div>
        </div>
 
        /* {thisUser.username !== user.username && !friends.find(friend => friend.username === user.username) && <CustomButton onClick={handleAddFriend}>send friend request</CustomButton>} */

    )
}

export default ProfileInformation