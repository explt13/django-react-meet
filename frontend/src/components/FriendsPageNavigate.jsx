import React, { useContext, useMemo, useState } from 'react'
import CustomButton from './UI/CustomButton/CustomButton';
import { useParams } from 'react-router-dom';
import FriendService from '../API/FriendService';
import classes from './styles/FriendsPageNavigate.module.css'
import UserContext from '../context/UserContext';

const FriendsPageNavigate = ({setTab}) => {

  return (
    <div className={classes.navigate}>
        <div>
            <CustomButton className={classes.navigateItem} onClick={() => setTab('friends')}>All friends</CustomButton>
            <CustomButton className={classes.navigateItem} onClick={() => setTab('sent')}>Sent requests</CustomButton>
            <CustomButton className={classes.navigateItem} onClick={() => setTab('recieved')}>Recieved requests</CustomButton>
        </div>
    </div>
  )
}

export default FriendsPageNavigate