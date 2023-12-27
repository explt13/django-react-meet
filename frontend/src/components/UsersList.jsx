import React, { useContext, useEffect, useState } from 'react'
import classes from './styles/UsersList.module.css'
import { Link } from 'react-router-dom'
import CustomButton from './UI/CustomButton/CustomButton'



const UsersList = ({resultList, tab, forMap, selectedUsers, handleAccept, handleReject, handleDelete, onUserClick}) => {
    
    return (
        <>
            {resultList.map(user => (
                <div
                key={user.id}
                className={[classes.userContainer, forMap ? classes.forMap : undefined, forMap && (selectedUsers.find(selectedUsers => selectedUsers.username === user.username) ? classes.selectedUser : classes.unSelectedUser)].join(' ')}
                onClick={forMap ? () => onUserClick(user) : undefined}
                >
                    <div className={[classes.userImage, forMap ? classes.forMap : undefined].join(' ')}>
                        <img src={`http://127.0.0.1:8000/${user.profile_pic}`} />
                    </div>
                    <div className={[classes.information, forMap ? classes.forMap : undefined].join(' ')}>
                        <div className={[classes.userFullName, forMap ? classes.forMap : undefined].join(' ')}>
                            {!forMap
                            ? <Link to={`/user/${user.username}`}>{user.first_name} {user.last_name}</Link>
                            : user.first_name
                            }
                        </div>
                        <div className={[classes.userUsername, forMap ? classes.forMap : undefined].join(' ')}>
                            {user.username}
                        </div>

                    </div>

                    {!forMap
                    &&
                    <>
                        {tab === 'recieved' &&
                        <div className={classes.additional}>
                            <CustomButton onClick={() => handleAccept(user.friendship_id)}>Accept</CustomButton>
                            <CustomButton onClick={() => handleReject(user.friendship_id)}>Reject</CustomButton>
                        </div>}

                        {tab === 'requested' &&
                        <div className={classes.additional}>
                            {user.status}
                        </div>}
                        
                        {tab === 'friends' &&
                        <div className={classes.additional}>
                            <CustomButton onClick={() => handleDelete(user.username)}>Delete</CustomButton>
                        </div>}
                    
                    </>
                    }
                    
                </div>
           
            ))}
        </>
    )
}

export default UsersList