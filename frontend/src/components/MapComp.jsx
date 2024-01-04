import React, { useContext, useEffect, useId, useMemo, useState } from 'react'
import classes from './styles/MapComp.module.css'
import Map from './Map'
import UsersList from './UsersList'
import UserContext from '../context/UserContext'
import { useLocation } from 'react-router-dom'
import Loader from './UI/Loader/Loader'
import MapContext from '../context/MapContext'
import CustomSelect from './UI/CustomSelect/CustomSelect'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationPinLock, faMap } from '@fortawesome/free-solid-svg-icons'
import CustomInput from './UI/CustomInput/CustomInput'

const MapComp = ({state}) => {
     // make for friends and searching ??
    const {selectedUsers, setSelectedUsers, position, setPosition, category, setCategory, setModalPopup, setEventInformation, senderSort, setSenderSort, setFriendsSort} = useContext(MapContext)
    const { friends, eventCategories } = useContext(UserContext)
    const [error, setError] = useState(null)
    const sentInputId = useId()
    const recievedInputId = useId()
    
    
    window.history.replaceState({}, document.title)

    useEffect(() => {
        if (state?.action === 'selectCategory'){ // ?. means not necessary field / e.g state is null there wont be error null doesnt have field action
            setCategory(state.category)
            setEventInformation(prevInformation => ({...prevInformation, category: state.category}))
        }
        if (state?.action === 'selectUser'){
            setSelectedUsers([{username: state.username, is_accepted: false}])
            setModalPopup(true)
        }
        if (state?.action === 'selectUserSelectCategory'){
            setCategory(state.category)
            setSelectedUsers([{username: state.username, is_accepted: false}])
            setEventInformation(prevInformation => ({...prevInformation, category: state.category}))
            setModalPopup(true)
        }
    }, [])


    useEffect(() => {
        
        const timeoutID = setTimeout(() => {
            const getLocation = () => {
                navigator.geolocation.getCurrentPosition(
                (pos) => {
                  const {latitude, longitude} = pos.coords
                  setPosition([latitude, longitude])
                },
                (err) => {
                setError(err)
                })
              }
              getLocation()
        }, 10)
        return () => clearTimeout(timeoutID)
        
    }, [])


    const handleSeletedUsers = (user) => {
        const isSelected = selectedUsers.find(selectedUser => selectedUser.username === user.username)
        if (!isSelected){
            setSelectedUsers(prevUsers => [...prevUsers, {username: user.username, is_accepted: false}])
        } else {
            setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.username !== user.username))
        }
    }

    const sortedEventCategories = useMemo(function(){
        return [...eventCategories].sort((a, b) => b.qty - a.qty)
    }, [eventCategories])
  


    return (
        !position && !error
        ? <Loader />
        :

        error
        ? 
        <div className={classes.mapGeoErrorContainer}>
            <div className={classes.mapGeoErrorIcon}><FontAwesomeIcon icon={faLocationPinLock}/></div>
            <div className={classes.mapGeoErrorText}>Allow geolocation to work with map</div>
         </div>
        :
        <div className={[classes.mapContainer, 'container'].join(' ')}>
            <Map />

            <div className={classes.rightPanel}>
                <div className={classes.sortPanel}>
                    <div className={classes.categorySelectContainer}>
                        Sort events
                        <CustomSelect
                        withNums={true}
                        value={category}
                        onChange={(ev) => setCategory(ev.target.value)}
                        className={classes.categorySelect}
                        defaultName='Categrory'
                        options={[{name: 'All', value: 'ALL'}, ...sortedEventCategories]}
                    />
                    </div>
                    <div className={classes.senderSort}>
                        <label htmlFor={sentInputId}>Sent</label><input onChange={(e) => setSenderSort((prevSort) => ({...prevSort, sent: !senderSort.sent}))} id={sentInputId} checked={senderSort.sent} type='checkbox' />
                        &nbsp;
                        <label htmlFor={recievedInputId}>Recieved</label><input onChange={(e) => setSenderSort((prevSort) => ({...prevSort, recieved: !senderSort.recieved}))} id={recievedInputId} checked={senderSort.recieved} type='checkbox' />
                    </div>
                </div>
                <div className={classes.friendsSelect}>
                    Sort events by friends
                    {friends && !(friends.length === 0)
                    ? <UsersList resultList={friends} forMap={true} onUserClick={handleSeletedUsers} selectedUsers={selectedUsers}/>
                    : <div >seems empty..</div>}
                </div>
                
            </div>
        </div>

  )
}

export default MapComp