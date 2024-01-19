import React, { useContext, useEffect, useState } from 'react'
import classes from './styles/UsersList.module.css'
import { Link } from 'react-router-dom'
import CustomButton from './UI/CustomButton/CustomButton'
import CustomCancelButton from './UI/CustomButton/CustomCancelButton'
import CustomAcceptButton from './UI/CustomButton/CustomAcceptButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

const UsersList = ({resultList,  ...props}) => {
    return (
   
        resultList.map(user => (
            <div
            key={user.id}
            className={[classes.userContainer, props.forMap ? classes.forMap : undefined, props.forMap && (props.friendsArray.find(selectedFriend => selectedFriend === user.username) ? classes.selectedFriend : classes.unSelectedFriend)].join(' ')}
            onClick={props.forMap ? () => props.onUserClick(user) : undefined}
            >
                <div className={classes.userInformation}>
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
                </div>

                {props.forSearch &&

                <div className={classes.additional}>
                    {props.sentFriendRequests.find(friend => friend.username === user.username) ?
                    <div className={classes.pendingForSearch}>pending</div>
                    :
                    props.friends.find(friend => friend.username === user.username)
                    ?
                    <div className={classes.friendsForSearch}>Friends <FontAwesomeIcon icon={faCheck}/></div>
                    :
                    <CustomButton onClick={() => props.addFriend(user.username)}>Friend request</CustomButton>
                    }
                </div>
                }
                
                {props.forFriends
                &&
                <div className={classes.additional}>
                    {props.tab === 'received' &&
                    <>
                        <CustomAcceptButton onClick={() => props.handleAccept(user.friendship_id)}>Accept</CustomAcceptButton>
                        <CustomCancelButton onClick={() => props.handleReject(user.friendship_id)}>Reject</CustomCancelButton>
                    </>
                    }
                    {props.tab === 'sent' &&
                        <CustomCancelButton onClick={() => props.handleCancel(user.friendship_id)}>Cancel request</CustomCancelButton>
                    }
                    {props.tab === 'friends' &&
                        <CustomCancelButton onClick={() => props.handleDelete(user.username)}>Delete</CustomCancelButton>
                    }
                </div>
                }
                
            </div>
        
        ))
    )
}

export default UsersList