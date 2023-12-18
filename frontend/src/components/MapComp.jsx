import React, { useContext, useEffect, useState } from 'react'
import classes from './styles/MapComp.module.css'
import Map from './Map'
import UsersList from './UsersList'
import UserContext from '../context/UserContext'
import { useLocation } from 'react-router-dom'
import Loader from './UI/Loader/Loader'

const MapComp = ({position, error }) => {
    const [selectedUsers, setSelectedUsers] = useState([]) // make for friends and searching ??
    const { friends } = useContext(UserContext)
    const location = useLocation()
    const {state} = location

    useEffect(() => {
        if (state){
            setSelectedUsers(prevUsers => [...prevUsers, {username: state.username, is_accepted: false}])
        }
        
    }, [])

    const handleSeletedUsers = (user) => {
        const isSelected = selectedUsers.find(selectedUser => selectedUser.username === user.username)
        if (!isSelected){
            setSelectedUsers(prevUsers => [...prevUsers, {username: user.username, is_accepted: false}])
        } else {
            setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.username !== user.username))
        }
        
    }

    
    

    return (
        error
        ? <Loader />
        :
        <div className={[classes.mapContainer, 'container'].join(' ')}>
            <Map selectedUsers={selectedUsers} position={position}/> {/* make handlers of marker here? */}
            <div className={classes.friendsContainer}>
                {friends && !(friends.length === 0)
                ? <UsersList resultList={friends} forMap={true} onUserClick={handleSeletedUsers} selectedUsers={selectedUsers}/>
                : <div >seems empty..</div>}
            </div>
        </div>
  )
}

export default MapComp