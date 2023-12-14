import React, { useContext, useState } from 'react'
import classes from './styles/MapComp.module.css'
import Map from './Map'
import UsersList from './UsersList'
import UserContext from '../context/UserContext'

const MapComp = ({ readyToRender }) => {
    const [selectedUsers, setSelectedUsers] = useState([]) // make for friends and searching ??
    const { friends } = useContext(UserContext)

    
    const handleSeletedUsers = (user) => {
        const isSelected = selectedUsers.find(selectedUser => selectedUser.username === user.username)
        if (!isSelected){
            setSelectedUsers(prevUsers => [...prevUsers, {username: user.username, is_accepted: false}])
        } else {
            setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.username !== user.username))
        }
        
    }

    
    

    return (
        <div className={[classes.mapContainer, 'container'].join(' ')}>
            <Map readyToRender={readyToRender} selectedUsers={selectedUsers}/> {/* make handlers of marker here? */}
            <div className={classes.friendsContainer}>
                {friends && !(friends.length === 0)
                ? <UsersList resultList={friends} forMap={true} onUserClick={handleSeletedUsers} selectedUsers={selectedUsers}/>
                : <div >seems empty..</div>}
            </div>
        </div>
  )
}

export default MapComp