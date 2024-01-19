import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import UserContext from '../context/UserContext'
import { Icon, marker } from 'leaflet'
import EventService from '../API/EventService'
import AuthContext from '../context/AuthContext'
import { Marker, Popup, useMapEvents } from 'react-leaflet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faIceCream, faXmark } from '@fortawesome/free-solid-svg-icons'
import classes from './styles/LocationMarkers.module.css'
import { Link } from 'react-router-dom'
import CustomButton from './UI/CustomButton/CustomButton'
import L   from 'leaflet'
import MapContext from '../context/MapContext'
import useReceivedEvents from '../hooks/useReceivedEvents'
import { getFormattedFullDate } from '../utils/calendarUtil'
import CustomCancelButton from './UI/CustomButton/CustomCancelButton'



const ReceivedEvents = () => {
    const {csrftoken} = useContext(AuthContext)
    const {thisUser, receivedEvents, setReceivedEvents, setAcceptedEvents, setEventCategories, setAlertResponse} = useContext(UserContext)
    const {sort} = useContext(MapContext)
    const sortedEvents = useReceivedEvents(receivedEvents, sort.category, sort.friendsArray, sort.accepted, sort.date)

   
    const customIcon = (name) =>{
        const icon = new L.divIcon({
            className: classes.myDivIcon,
            html: name,
            iconSize: [0, 0], // Set the size of the icon
        });
        return icon
    } 

    const handleMarkerAccept = async (markerID) => { // move to mapComp?
        const response = await EventService.acceptEvent(markerID, csrftoken)
        setReceivedEvents(prevEvents => prevEvents.map(event =>
        event.marker_id === markerID
            ? {
                ...event,
                initial_recipients: event.initial_recipients.map(recipient => 
                    recipient.username === thisUser.username
                    ? {...recipient, status: 'ACCEPTED'}
                    : recipient
                )
            }
            : event))
        setAlertResponse({status: response.status, text: response.data})
    }

    const handleMarkerReject = async (markerID) => { // ?? accesptness for someone else?
        const event = receivedEvents.find(ev => ev.marker_id === markerID)
        const response = await EventService.rejectEvent(markerID, csrftoken)
        setReceivedEvents(prevEvents => prevEvents.filter(event => event.marker_id !== markerID))
        setEventCategories(prevCategories => prevCategories.map(category => category.value === event.category ? {...category, qty: category.qty - 1} : category))   
        setAlertResponse({status: response.status, text: response.data})
    }


    return (
        sortedEvents.map(event => {
        const recipient = event.initial_recipients.find(recipient => recipient.username === thisUser.username)
        return(
        <Marker
            id={event.marker_id}
            key={event.marker_id}
            position={[event.latitude, event.longitude]}
            icon={customIcon(event.icon)}
            draggable={false}
            
            >
            <Popup>
                {
                recipient.status === 'PENDING' &&// if user is recipient
                <div className={classes.choice}> 
                    <FontAwesomeIcon title='reject' icon={faXmark} style={{color: 'var(--main-red)'}} onClick={() => handleMarkerReject(event.marker_id)}/>
                    <FontAwesomeIcon title='accept' icon={faCheck} style={{color: 'var(--main-green)'}} onClick={() => handleMarkerAccept(event.marker_id)}/>
                </div>
                }

                <div className={classes.eventInformationContainer}>
                    {event.event_id && //why? i dont have websockets tho
                    <>
                    <strong className={classes.category}>{event.category}</strong>
                    <div className={classes.requester}>
                        <strong>Requester: </strong><Link to={`/user/${event.requester.username}`}>{event.requester.first_name + ' ' + event.requester.last_name}</Link></div>
                    <div className={classes.recipient}>
                        <strong>Recipients: </strong>
                        {event.initial_recipients.map(recipient =>
                        <span key={recipient.username} className={classes[recipient.status]}>
                            {thisUser.username === recipient.username
                            ? <strong>You</strong>
                            : <Link to={`/user/${recipient.username}`}>{recipient.first_name} {recipient.last_name}</Link>
                            }
                            &nbsp;
                        </span>
                        )}
                    </div> 

                    <div className={classes.popup}>
                        <strong>Message: </strong><br/>
                        {event.text} <br/>
                        <strong>Time: </strong><br/>
                        {getFormattedFullDate(event.date)} at {event.time}
                    </div>
                    </>
                    }
                </div>

                {(recipient && recipient.status === 'ACCEPTED') &&
                <div className={classes.cancelEventButton}>
                    <CustomCancelButton onClick={() => handleMarkerReject(event.marker_id)}>Cancel participation</CustomCancelButton>
                </div>
                }
            </Popup>
        </Marker>
        )})
  )
}

export default ReceivedEvents