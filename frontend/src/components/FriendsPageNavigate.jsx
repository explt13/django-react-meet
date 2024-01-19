import React, { useContext, useMemo, useState } from 'react'
import CustomButton from './UI/CustomButton/CustomButton';
import classes from './styles/FriendsPageNavigate.module.css'


const FriendsPageNavigate = ({setTab}) => {

  return (
    <div className={classes.navigate}>
      <div className={classes.navigateHeader}>Navigate</div>
      <CustomButton className={classes.navigateItem} onClick={() => setTab('friends')}>All friends</CustomButton>
      <CustomButton className={classes.navigateItem} onClick={() => setTab('sent')}>Sent requests</CustomButton>
      <CustomButton className={classes.navigateItem} onClick={() => setTab('received')}>Received requests</CustomButton>
    </div>
  )
}

export default FriendsPageNavigate