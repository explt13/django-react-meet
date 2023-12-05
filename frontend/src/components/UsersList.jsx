import React, { useContext, useEffect, useState } from 'react'
import classes from './styles/UsersList.module.css'
import { Link } from 'react-router-dom'
import CustomButton from './UI/CustomButton/CustomButton'



const UsersList = ({resultList, tab, forMap, selectedUsers, handleAccept, handleReject, handleDelete, onUserClick}) => {

    return (
        <div>
            {resultList.map(user => (
                <div key={user.username}>
                    <div className={[classes.userContainer, forMap && (selectedUsers.includes(user.username) ? classes.selectedUser : classes.unSelectedUser)].join(' ')} style={{
                        '--map-width': forMap && '64px',
                        }}
                        onClick={forMap ? () => onUserClick(user) : undefined}>
                        <div className={classes.userImage}>
                            <img src={`http://127.0.0.1:8000/${user.profile_pic}`} />
                        </div>
                        <div className={classes.information} style={forMap && {'--map-marginTop': '0px', '--map-fontSize': '16px'}}>
                            <div className={classes.userUsername} style={forMap && {'--map-fontSize': '20px'}}>
                                <Link to={!forMap && `/user/${user.username}`}> {user.username} </Link>
                            </div>
                            <div className={classes.userFullName}>
                                {user.first_name} {user.last_name}
                            </div>
                        </div>

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
                    </div>
                    <hr />
                </div>
            ))}
        </div>
    )
}

export default UsersList