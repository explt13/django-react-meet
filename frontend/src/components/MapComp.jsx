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
import { faAngleDown, faLocationPinLock, faMap } from '@fortawesome/free-solid-svg-icons'
import CustomInput from './UI/CustomInput/CustomInput'
import CustomIcon from './UI/CustomIcon/CustomIcon'

const MapComp = ({state}) => {
     // make for friends and searching ??
    const {position, setPosition, canAddMarkers, setCanAddMarkers, setModalPopup, setEventInformation, minDate, maxDate, sort, setSort} = useContext(MapContext)
    const { friends, eventCategories, isLoading } = useContext(UserContext)
    const [dateClasses, setDateClasses] = useState()
    const [error, setError] = useState(null)
    const sentInputId = useId()
    const receivedInputId = useId()
    const strictInputId = useId()
    const acceptedInputId = useId()
    const dateInputId = useId()
    const dateInputRef = useRef(null)
    
    
    window.history.replaceState({}, document.title)
    

    useEffect(() => {
        if (state?.action === 'selectCategory'){ // ?. means not necessary field / e.g state is null there wont be error null doesnt have field action
            setSort(prevSort => ({...prevSort, category: state.category}))
            setEventInformation(prevInformation => ({...prevInformation, category: state.category}))
        }
        if (state?.action === 'selectUser'){
            setEventInformation(prevInformation => ({...prevInformation, selectedUsers: [{username: state.username, first_name: state.first_name, last_name: state.last_name}]}))
            setModalPopup(true)
            setCanAddMarkers(true)
        }
        if (state?.action === 'selectUserSelectCategory'){
            if (friends.find(friend => friend.username === state.username)){
                setEventInformation(prevInformation => ({...prevInformation, category: state.category, selectedUsers: [{username: state.username, first_name: state.first_name, last_name: state.last_name}]}))
            } else{
                setEventInformation(prevInformation => ({...prevInformation, category: state.category}))

            }
            setSort(prevSort => ({...prevSort, category: state.category}))
            setModalPopup(true)
            setCanAddMarkers(true)
        }
        if (state?.action === 'date'){
            setSort(prevSort => ({...prevSort, date: state.date}))
            setSort(prevSort => ({...prevSort, sent: false}))
            setDateClasses(classes.active)
        }
    }, [])

    useEffect(() =>{
        if (canAddMarkers && !sort.date){
            setDateClasses()
        }
    }, [sort.date])

    useEffect(() => {

        const timeoutID = setTimeout(() => {
            const getLocation = () => {

                navigator.geolocation.getCurrentPosition(
                (pos) => {
                  const {latitude, longitude} = pos.coords

                  setPosition([39, -77])
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
        const isSelected = sort.friendsArray.find(friendSelected => friendSelected === user.username)
        if (!isSelected){
            setSort(prevSort => ({...prevSort, friendsArray: [...prevSort.friendsArray, user.username]}))
        } else {
            setSort(prevSort => ({...prevSort, friendsArray: prevSort.friendsArray.filter(friend => friend !== user.username)}))
        }
    }



    const handleDateSort = (ev) => {
        setSort(prevSort => ({...prevSort, date: ev.target.value}))
        setDateClasses(classes.active)
        // ev.currentTarget.classList.add(classes.active)
    }
    const handleClearDate = (ev) => {
        setSort(prevSort => ({...prevSort, date: ''}))
        setDateClasses()
        // ev.currentTarget.closest(`.${classes.dateSort}`).querySelector('input[type=date]').classList.remove(classes.active)
    }

    const sortedEventCategories = useMemo(function(){
        return [...eventCategories].sort((a, b) => b.qty - a.qty)
    }, [eventCategories])

    const showSortMenu = () => {
        const sortPanel = document.getElementById('panelContainer')
        const icon = document.getElementById('sortMenuIcon')
        sortPanel.classList.toggle(classes.visible)
        icon.classList.toggle(classes.visible)
    }


    return (
        (!position && !error) || isLoading
        ? <Loader />
        :
        error
        ? 
        <div className={classes.mapGeoErrorContainer}>
            <div className={classes.mapGeoErrorIcon}><FontAwesomeIcon icon={faLocationPinLock}/></div>
            <div className={classes.mapGeoErrorText}>Allow geolocation to work with map</div>
         </div>
        :
        <div className={classes.container}>
            <Map />   
            <div id='panelContainer' className={classes.panelContainer}>
                <div className={classes.sortPanel}>
                    <div className={classes.categorySelectContainer}>
                        Sort events
                        <CustomSelect
                        withNums={true}
                        value={sort.category}
                        onChange={(ev) => setSort(prevSort => ({...prevSort, category: ev.target.value}))}
                        className={classes.categorySelect}
                        defaultName='Categrory'
                        options={[{name: 'All', value: 'ALL'}, ...sortedEventCategories]}
                    />
                    </div>
                    <div className={classes.senderSort}>
                        <label htmlFor={sentInputId}>Sent</label><input onChange={() => setSort(prevSort => ({...prevSort, sent: !prevSort.sent}))} id={sentInputId} checked={sort.sent} type='checkbox' />
                        &nbsp;
                        <label htmlFor={receivedInputId}>received</label><input onChange={() => setSort(prevSort => ({...prevSort, received: !prevSort.received}))} id={receivedInputId} checked={sort.received} type='checkbox' />
                    </div>
                    <div className={classes.strictSort}>
                        <label htmlFor={strictInputId}>Exact users</label><input onChange={() => setSort(prevSort => ({...prevSort, strict: !prevSort.strict}))} id={strictInputId} type='checkbox' checked={sort.strict}/>
                    </div>
                    <div className={classes.acceptedSort}>
                        <label htmlFor={acceptedInputId}>Only accepted</label><input onChange={() => setSort(prevSort => ({...prevSort, accepted: !prevSort.accepted}))} id={acceptedInputId} type='checkbox' checked={sort.accepted}/>
                    </div>
                    <div className={classes.dateSort} onClick={(ev) => {}}>
                        <label htmlFor={dateInputId}>Date</label><input min={minDate} max={maxDate} className={dateClasses} onClick={(ev) => ev.target.showPicker()} onChange={(ev) => handleDateSort(ev)} id={dateInputId} type='date' value={sort.date}/>
                        <span onClick={handleClearDate}>clear date</span>
                    </div>
                </div>
                <div className={classes.friendsSelect}>
                    Sort by friends
                    <div className={classes.friends}>
                    {friends && !(friends.length === 0)
                    ? <UsersList resultList={friends} forMap={true} onUserClick={handleSeletedUsers} friendsArray={sort.friendsArray}/>
                    : <div >seems empty..</div>}
                    </div>
                </div>
                
            </div>

            <div className={classes.mobilePanel} onClick={showSortMenu}>Sort<CustomIcon id='sortMenuIcon' className={classes.sortMenuIcon}><FontAwesomeIcon icon={faAngleDown} /></CustomIcon></div>
        </div>

  )
}

export default MapComp