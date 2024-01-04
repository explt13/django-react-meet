import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import UserContext from '../context/UserContext'
import { Icon, marker } from 'leaflet'
import EventService from '../API/EventService'
import AuthContext from '../context/AuthContext'
import { Marker, Popup, useMapEvents } from 'react-leaflet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faIceCream, faXmark } from '@fortawesome/free-solid-svg-icons'
import redMarker from './../media/img/redMarker.png'
import classes from './styles/LocationMarkers.module.css'
import { Link } from 'react-router-dom'
import CustomButton from './UI/CustomButton/CustomButton'
import L   from 'leaflet'
import MapContext from '../context/MapContext'
import useRecievedEvents from '../hooks/useRecievedEvents'



const RecievedEvents = () => {

    const {csrftoken} = useContext(AuthContext)
    const {thisUser, recievedEvents, setRecievedEvents, setAcceptedEvents, setEventCategories, setAlertResponse} = useContext(UserContext)
    const {category, friendsSortArray} = useContext(MapContext)
    const sortedCategoryAndFriendsEvents = useRecievedEvents(recievedEvents, category, friendsSortArray)

   
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
        setRecievedEvents(prevEvents => prevEvents.map(event =>
        event.marker_id === markerID
            ? {
                ...event,
                recipients: event.recipients.map(recipient => 
                    recipient.username === thisUser.username
                    ? {...recipient, is_accepted: true}
                    : recipient
                )
            }
            : event))
        setAcceptedEvents(prevEvents => [...prevEvents, recievedEvents.find(event => event.marker_id === markerID)])
        setAlertResponse({status: response.status, text: response.data})
    }

    const handleMarkerReject = async (markerID) => { // ?? accesptness for someone else?
        const event = recievedEvents.find(ev => ev.marker_id === markerID)
        const response = await EventService.rejectEvent(markerID, csrftoken)
        setRecievedEvents(prevEvents => prevEvents.filter(event => event.marker_id !== markerID))
        setEventCategories(prevCategories => prevCategories.map(category => category.value === event.category ? {...category, qty: category.qty - 1} : category))   
        setAlertResponse({status: response.status, text: response.data})
    }


    return (
        sortedCategoryAndFriendsEvents.map(event => {
        const recipient = event.recipients.find(recipient => recipient.username === thisUser.username)
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
                (event.event_id && !(thisUser.username === event.requester_username) && !recipient.is_accepted) &&// if user is recipient
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
                        <strong>Requester: </strong>
                        <Link to={`/user/${event.requester_username}`}>{event.requester_username}</Link>       
                    </div>
                    <div className={classes.recipient}>
                        <strong>Recipients: </strong>
                        {event.recipients.map(recipient =>
                        <span key={recipient.username}>
                            {thisUser.username === recipient.username
                            ? <strong>You</strong>
                            : <Link to={`/user/${recipient.username}`}>{recipient.username}</Link>
                            }
                            &nbsp;
                        </span>
                        )}
                    </div> 

                    <div className={classes.popup}>
                        <strong>Message: </strong><br/>
                        {event.text} <br/>
                        <strong>Time: </strong><br/>
                        {event.time}
                    </div>
                    </>
                    }
                </div>

                {(recipient && recipient.is_accepted) &&
                <div className={classes.cancelEventButton}>
                    <CustomButton onClick={() => handleMarkerReject(event.marker_id)}>Cancel participation</CustomButton>
                </div>
                }
            </Popup>
        </Marker>
        )})
  )
}

export default RecievedEvents