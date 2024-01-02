import React, { useContext, useEffect, useMemo, useState } from 'react'
import UserContext from '../context/UserContext'
import { Marker, Popup, useMapEvents } from 'react-leaflet'
import purpleMarker from './../media/img/purpleMarker.png'
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

const SentEvents = () => {
    const {thisUser, sentEvents, setSentEvents, setEventCategories, setAlertResponse} = useContext(UserContext)
    const {selectedUsers, setSelectedUsers, canAddMarkers, setCanAddMarkers, eventInformation, setEventInformation, category} = useContext(MapContext)
    const [draggable, setDraggable] = useState(false)
    const [minDate, maxDate] = getDateForInput()
    const {csrftoken} = useContext(AuthContext)

    
    const eventMarkers = {
        HEALTH: `<i class="${['fas', 'fa-plus-square', classes.health, classes.borderForIcon].join(' ')}"></i>`,
        EDUCATION: `<i class="${['fa-solid', 'fa-graduation-cap', classes.education, classes.borderForIcon].join(' ')}"></i>`,
        DINNER: `<i class="${['fa-solid', 'fa-mug-hot', classes.dinner, classes.borderForIcon].join(' ')}"></i>`,
        BAR: `<i class="${['fa-solid', 'fa-wine-glass', classes.bar, classes.borderForIcon].join(' ')}"></i>`,
        LEISURE: `<i class="${['fa-solid', 'fa-baseball-bat-ball', classes.leisure, classes.borderForIcon].join(' ')}"></i>`,
        RELAXATION: `<i class="${['fa-solid', 'fa-mountain-sun', classes.relaxation, classes.borderForIcon].join(' ')}"></i>`,
        HOLIDAY: `<i class="${['fa-solid', 'fa-snowman', classes.holiday, classes.borderForIcon].join(' ')}"></i>`,
        WORK: `<i class="${['fa-solid', 'fa-briefcase', classes.work, classes.borderForIcon].join(' ')}"></i>`,
        TRAVEL: `<i class="${['fa-solid', 'fa-car', classes.travel, classes.borderForIcon].join(' ')}"></i>`,
        SHOPING: `<i class="${['fa-solid', 'fa-bag-shopping', classes.shoping, classes.borderForIcon].join(' ')}"></i>`,

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
            time: event.time,
            text: event.text,
            category: event.category,
            latitude: event.latitude,
            longitude: event.longitude,
            recipients: selectedUsers,
            requester_username: thisUser.username,
            icon: event.icon
        }
        const response = await EventService.sendEvent(data, csrftoken)
        setSentEvents(prevEvents => prevEvents.map(event => event.marker_id === markerID ? {...event, recipients: selectedUsers, is_confirmed: true} : event))
        setEventCategories(prevCategories => prevCategories.map(category => category.value === event.category ? {...category, qty: category.qty + 1} : category))  
        setDraggable(false)
        setSelectedUsers([])
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

    const sortedEvents = useMemo(() => {
        if (category === 'ALL'){
            return [...sentEvents]
        }
        return [...sentEvents].filter(event => event.category === category) // my event not default event
    }, [category, sentEvents])

    
    useMapEvents({
        click(e) {
            if (canAddMarkers){
                const name = eventMarkers[eventInformation.category]
                const event = {
                    marker_id: Date.now() + Math.random(),
                    requester_username: thisUser.username,
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng,
                    icon: name,
                    text: eventInformation.text || 'See you soon',
                    time: getFormattedFullDate(eventInformation.time),
                    category: eventInformation.category,
                    is_confirmed: false,
                }
                setSentEvents(prevEvents => [...prevEvents, event])
                setCanAddMarkers(false)
                setDraggable(true)
                setEventInformation({text: '', time: minDate, category: 'HEALTH'})
            } 
        }
    })


    return (
        <React.Fragment>{
        sortedEvents.map(event => (
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
                    <>
                        {selectedUsers.length > 0
                        ?
                        <div className={classes.choice}> 
                        <FontAwesomeIcon title='decline' icon={faXmark} style={{color: 'var(--main-red)'}} onClick={() => handleMarkerReject(event.marker_id)}/>
                        <FontAwesomeIcon title='confirm' icon={faCheck} style={{color: 'var(--main-green)'}} onClick={() => handleMarkerAccept(event.marker_id)}/>
                        </div>
                        :
                        <div className={classes.noRecipientsSelected}>
                        <div style={{color: 'var(--main-red)', fontSize: '16px'}}>At least one user must be selected</div>
                        </div>
                        }

                    </>
                    }

                    <div className={classes.eventInformationContainer}>
                        <strong className={classes.category}>{event.category}</strong>
                        <div className={classes.requester}>
                            <strong>Requester: </strong>
                            You
                        </div>
                        <div className={classes.recipient}>
                            <strong>Recipients: </strong>
                            {((!event.event_id && !event.is_confirmed) ? selectedUsers : event.recipients).map((recipient, index) => 
                            <span key={recipient.username}>
                                {(index % 2 === 0) && <br /> }
                                <Link target='_blank' to={`/user/${recipient.username}`}>{recipient.username}</Link>
                                {(!(index === (!event.event_id ? selectedUsers : event.recipients).length - 1))&&','}&nbsp;
                            </span>
                            )}
                        </div> 

                        <div className={classes.popup}>
                            <strong>Message: </strong><br/>
                            {event.text} <br/>
                            <strong>Time: </strong><br/>
                            {event.time}
                        </div>
                    </div>
                    {(event.event_id || event.is_confirmed) &&
                    <div className={classes.cancelEventButton}>
                        <CustomButton onClick={() => handleCancelEvent(event.marker_id)}>Cancel Event</CustomButton>
                    </div>
                    }
                    {(!event.event_id && !event.is_confirmed && selectedUsers.length === 0) &&
                    <div className={classes.cancelEventButton}>
                        <CustomButton onClick={() => handleMarkerReject(event.marker_id)}>Cancel Event</CustomButton>
                    </div>
                    }
                    
                </Popup>
            </Marker>
        ))}
    </React.Fragment>
    )
}

export default SentEvents