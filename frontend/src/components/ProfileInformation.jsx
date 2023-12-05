import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../context/UserContext'
import classes from './styles/ProfileInformation.module.css'
import { useParams } from 'react-router-dom'
import UserService from '../API/UserService'
import Loader from './UI/Loader/Loader'
import CustomButton from './UI/CustomButton/CustomButton'
import AuthContext from '../context/AuthContext'

const ProfileInformation = () => {
    const {thisUser, setThisUser} = useContext(UserContext)
    const { csrftoken } = useContext(AuthContext)
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const params = useParams()


    useEffect(() => {
        const getUser = async () => {
            const user = await UserService.getUser(params.username)
            setUser(user)
            setIsLoading(false)
        }
        getUser()
        
    }, [params.username])
    

    const handleAddFriend = async () => {
        const data = await UserService.sendFriendRequest(user.username, csrftoken)
        console.log(data)
    }

    return (
        isLoading
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
            {thisUser.username !== user.username && <CustomButton onClick={handleAddFriend}>send friend request</CustomButton>}
            </div>
        </div>
    )
}

export default ProfileInformation