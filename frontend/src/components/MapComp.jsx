import React, { useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
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
    const {position, setPosition, setCanAddMarkers, category, setCategory, setModalPopup, setEventInformation, senderSort, setSenderSort, friendsSortArray, setFriendsSortArray, strictSort, setStrictSort, acceptedSort, setAcceptedSort, dateSort, setDateSort, minDate, maxDate} = useContext(MapContext)
    const { friends, eventCategories } = useContext(UserContext)
    const [dateClasses, setDateClasses] = useState()
    const [error, setError] = useState(null)
    const sentInputId = useId()
    const recievedInputId = useId()
    const strictInputId = useId()
    const acceptedInputId = useId()
    const dateInputId = useId()
    const dateInputRef = useRef(null)
    
    
    window.history.replaceState({}, document.title)

    useEffect(() => {
        if (state?.action === 'selectCategory'){ // ?. means not necessary field / e.g state is null there wont be error null doesnt have field action
            setCategory(state.category)
            setEventInformation(prevInformation => ({...prevInformation, category: state.category}))
        }
        if (state?.action === 'selectUser'){
            setEventInformation(prevInformation => ({...prevInformation, selectedUsers: [{username: state.username, is_accepted: false}]}))
            setModalPopup(true)
            setCanAddMarkers(true)
        }
        if (state?.action === 'selectUserSelectCategory'){
            if (friends.find(friend => friend.username === state.username)){
                setEventInformation(prevInformation => ({...prevInformation, category: state.category, selectedUsers: [{username: state.username, is_accepted: false}]}))
            } else{
                setEventInformation(prevInformation => ({...prevInformation, category: state.category}))

            }
            setCategory(state.category)
            setModalPopup(true)
            setCanAddMarkers(true)
        }
        if (state?.date){
            setDateSort(state.date)
            setSenderSort(prevSort => ({...prevSort, sent: false}))
            setDateClasses(classes.active)
        }
    }, [])

    useEffect(() => {
        
    }, [dateInputRef])

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
        const isSelected = friendsSortArray.find(friendSelected => friendSelected === user.username)
        if (!isSelected){
            setFriendsSortArray(prevUsers => [...prevUsers, user.username])
        } else {
            setFriendsSortArray(friendsSortArray.filter(friendsSelected => friendsSelected !== user.username))
        }
    }

    const handleDateSort = (ev) => {
        setDateSort(ev.target.value)
        setDateClasses(classes.active)
        // ev.currentTarget.classList.add(classes.active)
    }
    const handleClearDate = (ev) => {
        setDateSort('')
        setDateClasses()
        // ev.currentTarget.closest(`.${classes.dateSort}`).querySelector('input[type=date]').classList.remove(classes.active)
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
                        <label htmlFor={sentInputId}>Sent</label><input onChange={() => setSenderSort((prevSort) => ({...prevSort, sent: !senderSort.sent}))} id={sentInputId} checked={senderSort.sent} type='checkbox' />
                        &nbsp;
                        <label htmlFor={recievedInputId}>Recieved</label><input onChange={() => setSenderSort((prevSort) => ({...prevSort, recieved: !senderSort.recieved}))} id={recievedInputId} checked={senderSort.recieved} type='checkbox' />
                    </div>
                    <div className={classes.strictSort}>
                        <label htmlFor={strictInputId}>Exact users</label><input onChange={() => setStrictSort(!strictSort)} id={strictInputId} type='checkbox' checked={strictSort}/>
                    </div>
                    <div className={classes.acceptedSort}>
                        <label htmlFor={acceptedInputId}>Accepted events</label><input onChange={() => setAcceptedSort(!acceptedSort)} id={acceptedInputId} type='checkbox' checked={acceptedSort}/>
                    </div>
                    <div className={classes.dateSort} onClick={(ev) => {}}>
                        <label htmlFor={dateInputId}>Date</label><input min={minDate} max={maxDate} className={dateClasses} onClick={(ev) => ev.target.showPicker()} onChange={(ev) => handleDateSort(ev)} id={dateInputId} type='date' value={dateSort}/>
                        <span onClick={handleClearDate}>clear</span>
                    </div>
                </div>
                <div className={classes.friendsSelect}>
                    Sort by friends
                    {friends && !(friends.length === 0)
                    ? <UsersList resultList={friends} forMap={true} onUserClick={handleSeletedUsers} friendsSortArray={friendsSortArray}/>
                    : <div >seems empty..</div>}
                </div>
                
            </div>
        </div>

  )
}

export default MapComp