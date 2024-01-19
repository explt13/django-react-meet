import React, { useContext, useEffect, useMemo, useState } from 'react'
import UserContext from '../context/UserContext'
import { Marker, Popup, useMapEvents } from 'react-leaflet'
import EventService from '../API/EventService'
import AuthContext from '../context/AuthContext'
import { Icon } from 'leaflet'
import classes from './styles/LocationMarkers.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import CustomButton from './UI/CustomButton/CustomButton'
import { Link } from 'react-router-dom'
import MapContext from '../context/MapContext'
import L from 'leaflet'
import { getFormattedFullDate, getDateForInput } from '../utils/calendarUtil'
import useSentEvents from '../hooks/useSentEvents'
import CustomCancelButton from './UI/CustomButton/CustomCancelButton'

const SentEvents = () => {
    const {thisUser, sentEvents, setSentEvents, setEventCategories, setAlertResponse} = useContext(UserContext)
    const {canAddMarkers, setCanAddMarkers, eventInformation, setEventInformation, sort} = useContext(MapContext)
    const [minDate, maxDate] = getDateForInput()
    const {csrftoken} = useContext(AuthContext)
    const sortedSentEvents = useSentEvents(sentEvents, sort.category, sort.friendsArray, sort.strict, sort.date)

    
    const eventMarkers = {
        HEALTH: `<i class="${['fas', 'fa-plus-square', classes.HEALTH, classes.borderForIcon].join(' ')}"></i>`,
        EDUCATION: `<i class="${['fa-solid', 'fa-graduation-cap', classes.EDUCATION, classes.borderForIcon].join(' ')}"></i>`,
        DINNER: `<i class="${['fa-solid', 'fa-mug-hot', classes.DINNER, classes.borderForIcon].join(' ')}"></i>`,
        BAR: `<i class="${['fa-solid', 'fa-wine-glass', classes.BAR, classes.borderForIcon].join(' ')}"></i>`,
        LEISURE: `<i class="${['fa-solid', 'fa-baseball-bat-ball', classes.LEISURE, classes.borderForIcon].join(' ')}"></i>`,
        RELAXATION: `<i class="${['fa-solid', 'fa-mountain-sun', classes.RELAXATION, classes.borderForIcon].join(' ')}"></i>`,
        HOLIDAY: `<i class="${['fa-solid', 'fa-snowman', classes.HOLIDAY, classes.borderForIcon].join(' ')}"></i>`,
        WORK: `<i class="${['fa-solid', 'fa-briefcase', classes.WORK, classes.borderForIcon].join(' ')}"></i>`,
        TRAVEL: `<i class="${['fa-solid', 'fa-car', classes.TRAVEL, classes.borderForIcon].join(' ')}"></i>`,
        SHOPING: `<i class="${['fa-solid', 'fa-bag-shopping', classes.SHOPING, classes.borderForIcon].join(' ')}"></i>`,

    }

    const customIcon = (name) =>{
        const icon = new L.divIcon({
            className: classes.myDivIcon,
            html: name,
            iconSize: [32, 32], // Set the size of the icon
        });
        return icon
    } 

    const handleMarkerDrag = (e) => {
        const {lat, lng} = e.target.getLatLng()
        setSentEvents(prevEvents => prevEvents.map(event => event.marker_id === e.target.options.id ? {...event, latitude: lat, longitude: lng} : event))
    }

    const handleMarkerAccept = async (markerID) => { // move to mapComp?
        const event = sentEvents.find(event => event.marker_id === markerID)
        const data = {
            marker_id: event.marker_id,
            date: event.date,
            time: event.time,
            text: event.text,
            category: event.category,
            latitude: event.latitude,
            longitude: event.longitude,
            recipients: event.initial_recipients,
            icon: event.icon,
            requester: thisUser
        }
        const response = await EventService.sendEvent(data, csrftoken)
        setSentEvents(prevEvents => prevEvents.map(event => event.marker_id === markerID ? {...event, is_confirmed: true} : event))
        setEventCategories(prevCategories => prevCategories.map(category => category.value === event.category ? {...category, qty: category.qty + 1} : category))  
        setAlertResponse({status: response.status, text: response.data})
    }

    const handleMarkerReject= async (markerID) => { // ?? accesptness for someone else?
        setSentEvents(sentEvents.filter(event => event.marker_id !== markerID)) // automically set
    }

    const handleCancelEvent = async (markerID) => { // automically set
        const event = sentEvents.find(event => event.marker_id === markerID)
        const response = await EventService.cancelEvent(markerID, csrftoken)
        setSentEvents(sentEvents.filter(event => event.marker_id !== markerID))
        setEventCategories(prevCategories => prevCategories.map(category => category.value === event.category ? {...category, qty: category.qty - 1} : category))   
        setAlertResponse({status: response.status, text: response.data})
    }

    

    
    useMapEvents({
        click(e) {
            if (canAddMarkers){
                const name = eventMarkers[eventInformation.category]
                const event = {
                    marker_id: Date.now() + Math.random(),
                    initial_recipients: eventInformation.selectedUsers,
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng,
                    icon: name,
                    text: eventInformation.text,
                    date: eventInformation.date,
                    time: eventInformation.time,
                    category: eventInformation.category,
                    is_confirmed: false,
                }
                setSentEvents(prevEvents => [...prevEvents, event])
                setCanAddMarkers(false)
                setEventInformation({text: '', date: minDate, time: '', category: '', selectedUsers: []})
            } 
        }
    })


    return (
        <React.Fragment>{
            sortedSentEvents.map(event => {
            return    (
            <Marker
            id={event.marker_id}
            key={event.marker_id}
            eventHandlers={{dragend: handleMarkerDrag}}
            position={[event.latitude, event.longitude]}
            icon={customIcon(event.icon)}
            draggable={!event.event_id && !event.is_confirmed}
            >
                <Popup>
                    {
                    (!event.event_id && !event.is_confirmed) &&
                        <div className={classes.choice}> 
                        <FontAwesomeIcon title='decline' icon={faXmark} style={{color: 'var(--main-red)'}} onClick={() => handleMarkerReject(event.marker_id)}/>
                        <FontAwesomeIcon title='confirm' icon={faCheck} style={{color: 'var(--main-green)'}} onClick={() => handleMarkerAccept(event.marker_id)}/>
                        </div>
                    }

                    <div className={classes.eventInformationContainer}>
                        <strong className={[classes[event.category], classes['category']].join(' ')}>{event.category}</strong>
                        <div className={classes.requester}><strong>Requester: </strong>You</div>
                        <div className={classes.recipient}>
                            <strong>Recipients: </strong>
                            {(event.initial_recipients).map((recipient, index, arr) =>
                            <span key={recipient.username} className={classes[recipient.status ?? 'PENDING']}>
                                {(index % 2 === 0) && <br /> }
                                <Link target='_blank' to={`/user/${recipient.username}`}>{recipient.first_name} {recipient.last_name}</Link>
                                {(!(index === arr.length - 1))&&','}&nbsp;
                            </span>
                            )}
                        </div> 

                        <div className={classes.popup}>
                            <strong>Message: </strong><br/>
                            {event.text} <br/>
                            <strong>Time: </strong><br/>
                            {getFormattedFullDate(event.date)} at {event.time}
                        </div>
                    </div>
                    {(event.event_id || event.is_confirmed) &&
                    <div className={classes.cancelEventButton}>
                        <CustomCancelButton onClick={() => handleCancelEvent(event.marker_id)}>Cancel Event</CustomCancelButton>
                    </div>
                    }
                    {(!event.event_id && !event.is_confirmed) &&
                    <div className={classes.cancelEventButton}>
                        <CustomCancelButton onClick={() => handleMarkerReject(event.marker_id)}>Cancel Event</CustomCancelButton>
                    </div>
                    }
                    
                </Popup>
            </Marker>
        )})}
    </React.Fragment>
    )
}

export default SentEvents