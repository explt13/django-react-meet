import React, { useContext, useEffect, useState } from 'react'
import classes from './styles/UsersList.module.css'
import { Link } from 'react-router-dom'
import CustomButton from './UI/CustomButton/CustomButton'



const UsersList = ({resultList,  ...props}) => {
    
    return (
        <>
            {resultList.map(user => (
                <div
                key={user.id}
                className={[classes.userContainer, props.forMap ? classes.forMap : undefined, props.forMap && (props.selectedUsers.find(selectedUser => selectedUser.username === user.username) ? classes.selectedUser : classes.unSelectedUser)].join(' ')}
                onClick={props.forMap ? () => props.onUserClick(user) : undefined}
                >
                    <div className={classes.userImage}>
                        <img src={`http://127.0.0.1:8000/${user.profile_pic}`} />
                    </div>
                    <div className={classes.information}>
                        <div className={classes.userFullName}>
                            {!props.forMap
                            ? <Link to={`/user/${user.username}`}>{user.first_name} {user.last_name}</Link>
                            : user.first_name
                            }
                        </div>
                        <div className={classes.userUsername}>
                            {user.username}
                        </div>

                    </div>

                    {!props.forMap
                    &&
                    <>
                        {props.tab === 'recieved' &&
                        <div className={classes.additional}>
                            <CustomButton onClick={() => props.handleAccept(user.friendship_id)}>Accept</CustomButton>
                            <CustomButton onClick={() => props.handleReject(user.friendship_id)}>Reject</CustomButton>
                        </div>}

                        {props.tab === 'sent' &&
                        <div className={classes.additional}>
                            <CustomButton onClick={() => props.handleCancel(user.friendship_id)}>Cancel request</CustomButton>
                        </div>}
                        
                        {props.tab === 'friends' &&
                        <div className={classes.additional}>
                            <CustomButton onClick={() => props.handleDelete(user.username)}>Delete</CustomButton>
                        </div>}
                    
                    </>
                    }
                    
                </div>
           
            ))}
        </>
    )
}

export default UsersList