import React, { useContext, useEffect, useInsertionEffect, useRef, useState } from 'react'
import { Marker, Popup, useMapEvent, useMapEvents } from 'react-leaflet'
import { Icon } from 'leaflet'
import redMarker from './../media/img/redMarker.png'
import purpleMarker from './../media/img/purpleMarker.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import classes from './styles/LocationMarkers.module.css'
import EventService from '../API/EventService'
import AuthContext from '../context/AuthContext'
import UserContext from '../context/UserContext'
import Loader from './UI/Loader/Loader'
import { Link } from 'react-router-dom'
import CustomButton from './UI/CustomButton/CustomButton'

const LocationMarkers = ({selectedUsers, canAddMarkers, setCanAddMarkers, eventInformation}) => {
    const [draggable, setDraggable] = useState(false)
    const {csrftoken} = useContext(AuthContext)
    const {thisUser, events, setEvents, isLoading} = useContext(UserContext)
    


    function defineMarker(color){
        const customIcon = new Icon({
          iconUrl: color,
          iconSize: [64, 64]
        })
        return customIcon
    }

    const handleMarkerDrag = (e) => {
        const {lat, lng} = e.target.getLatLng()
        setEvents(prevMarkers => prevMarkers.map(marker => marker.marker_id === e.target.options.id ? {...marker, latitude: lat, longitude: lng} : marker))
        
    }
    


    const handleMarkerAccept = async (markerID, requester_username) => { // move to mapComp?
        if (thisUser.username === requester_username){
            const marker = events.find(m => m.marker_id === markerID)
            const data = {
                marker_id: marker.marker_id,
                time: marker.time,
                text: marker.text,
                latitude: marker.latitude,
                longitude: marker.longitude,
                recipients: selectedUsers,
                requester_username: thisUser.username
            }
            const response = await EventService.sendEvent(data, csrftoken)
            setDraggable(false)
            setEvents(prevMarkers => prevMarkers.map(marker => marker.marker_id === markerID ? {...marker, is_confirmed: true} : marker))
            console.log(response)
        } else {
            const response = await EventService.acceptEvent(markerID, csrftoken)
            setEvents(prevMarkers => prevMarkers.map(marker => 
            marker.marker_id === markerID
                ? {
                    ...marker,
                    recipients: marker.recipients.map(recipient => 
                        recipient.username === thisUser.username
                        ? {...recipient, is_accepted: true}
                        : recipient
                    )
                }
                : marker))

            console.log(response)
        }
        
    }

    const handleMarkerReject= async (markerID, requester_username) => { // ?? accesptness for someone else?
        if (thisUser.username === requester_username){
            setEvents(events.filter(marker => marker.marker_id !== markerID)) // automically set
        } else {
            const response = await EventService.rejectEvent(markerID, csrftoken)
            setEvents(events.filter(marker => marker.marker_id !== markerID))
            console.log(response)
        }
        
    }

    const handleCancelEvent = async (markerID) => { // automically set
    
        const response = await EventService.cancelEvent(markerID, csrftoken)
        setEvents(events.filter(marker => marker.marker_id !== markerID))
        console.log(response)

        
    }


    const map = useMapEvents({
        click(e) {
            if (canAddMarkers){
                const marker = {
                    marker_id: Date.now() + Math.random(),
                    requester_username: thisUser.username,
                    recipients: selectedUsers,
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng,
                    icon: defineMarker(purpleMarker),
                    text: eventInformation.text || 'See you soon',
                    time: eventInformation.time,
                    is_confirmed: false,
                }
                setEvents(prevMarkers => [...prevMarkers, marker])
                setCanAddMarkers(false)
                setDraggable(true)
            } else{
                map.locate()       
            }
        },
        locationfound(e){
            map.flyTo(e.latlng, map.getZoom())
        }
        
    })

  return (
    <React.Fragment>
        {events.map(marker =>
        {
        const recipient = marker.recipients.find(recipient => recipient.username === thisUser.username)
        return (
        <Marker
            id={marker.marker_id}
            eventHandlers={{dragend: handleMarkerDrag}}
            key={marker.marker_id} position={[marker.latitude, marker.longitude]}
            icon={defineMarker(thisUser.username === marker.requester_username ? purpleMarker : redMarker)}
            draggable={!marker.event_id && draggable}
            >
            <Popup>
                {
                ((marker.event_id && !(thisUser.username === marker.requester_username) && !recipient.is_accepted) || // if user is recipient
                (!marker.event_id && (thisUser.username === marker.requester_username)) && !marker.is_confirmed) && // if user is requester and not confirmed marker yet
                <div className={classes.choice}> 
                    <FontAwesomeIcon title={'decline'} icon={faXmark} style={{color: 'var(--cancel-red)'}} onClick={() => handleMarkerReject(marker.marker_id, marker.requester_username)}/>
                    <FontAwesomeIcon title={recipient ? 'accept' : 'confirm'} icon={faCheck} style={{color: 'var(--accept-green)'}} onClick={() => handleMarkerAccept(marker.marker_id, marker.requester_username)}/>
                </div>
                }

                <div className={classes.eventInformationContainer}>
                    {marker.event_id &&
                    <>
                    <div className={classes.requester}>
                        <strong>Requester: </strong>
                        {thisUser.username === marker.requester_username
                        ? <>You</>
                        : <Link to={`/user/${marker.requester_username}`}>{marker.requester_username}</Link>
                        }
                        
                    </div>
                    <div className={classes.recipient}>
                        <strong>Recipients: </strong>
                        {marker.recipients.map(recipient => 
                        <span key={recipient.username}>
                            {thisUser.username === recipient.username
                            ? <strong>You</strong>
                            : <Link to={`/user/${recipient.username}`}>{recipient.username}</Link>
                            }
                            &nbsp;
                        </span>
                        )}
                    </div> 
                    </>
                    }
                    <div className={classes.popup}>
                        <strong>Message: </strong><br/>
                        {marker.text} <br/>
                        <strong>Time: </strong><br/>
                        {marker.time}
                    </div>
                </div>

                {((thisUser.username === marker.requester_username) || (recipient && recipient.is_accepted))&&
                <div className={classes.cancelEventButton}>
                    <CustomButton onClick={() => recipient ? handleMarkerReject(marker.marker_id, marker.requester_username) : handleCancelEvent(marker.marker_id)}>{recipient ? 'Cancel participation' : 'Cancel event'}</CustomButton>
                </div>
                }
            </Popup>
        </Marker>)}
        )
    }
    </React.Fragment>
  )
}

export default LocationMarkers