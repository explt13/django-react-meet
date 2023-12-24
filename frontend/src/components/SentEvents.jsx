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


const SentEvents = () => {
    const {thisUser, sentEvents, setSentEvents} = useContext(UserContext)
    const {selectedUsers, setSelectedUsers, canAddMarkers, setCanAddMarkers, eventInformation, category} = useContext(MapContext)
    const [draggable, setDraggable] = useState(false)
    const {csrftoken} = useContext(AuthContext)

    function defineMarker(color){
        const customIcon = new Icon({
          iconUrl: color,
          iconSize: [64, 64]
        })
        return customIcon
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
            requester_username: thisUser.username
        }
        const response = await EventService.sendEvent(data, csrftoken)
        setSentEvents(prevEvents => prevEvents.map(event => event.marker_id === markerID ? {...event, recipients: selectedUsers, is_confirmed: true} : event))
        setDraggable(false)
        setSelectedUsers([])
        console.log(response)
    }

    const handleMarkerReject= async (markerID) => { // ?? accesptness for someone else?
        setSentEvents(sentEvents.filter(event => event.marker_id !== markerID)) // automically set
        
    }

    const handleCancelEvent = async (markerID) => { // automically set
        const response = await EventService.cancelEvent(markerID, csrftoken)
        setSentEvents(sentEvents.filter(event => event.marker_id !== markerID))
        console.log(response)
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
                const event = {
                    marker_id: Date.now() + Math.random(),
                    requester_username: thisUser.username,
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng,
                    icon: defineMarker(purpleMarker),
                    text: eventInformation.text || 'See you soon',
                    time: eventInformation.time,
                    category: eventInformation.category,
                    is_confirmed: false,
                }
                setSentEvents(prevEvents => [...prevEvents, event])
                setCanAddMarkers(false)
                setDraggable(true)
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
            icon={defineMarker(purpleMarker)}
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