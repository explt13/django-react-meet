import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../context/UserContext'
import classes from './styles/ProfileInformation.module.css'
import { useParams } from 'react-router-dom'
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
        <div className={classes.profileInformation}>
            <div className={classes.image}>
                <img src={`http://127.0.0.1:8000/${user.profile_pic}`} />
            </div>
            <div className={classes.information}>
                <div className={classes.fullName}>
                    {user.first_name} {user.last_name}
                </div>
                <div className={classes.username}>
                    @{user.username}
                </div>
            </div>
            <div className={classes.buttons}>
            {thisUser.username !== user.username && !friends.find(friend => friend.username === user.username) && <CustomButton onClick={handleAddFriend}>send friend request</CustomButton>}
            </div>
        </div>
    )
}

export default ProfileInformation