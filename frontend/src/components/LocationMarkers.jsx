import React, { useContext, useEffect, useInsertionEffect, useRef, useState } from 'react'
import { Marker, Popup, useMapEvent, useMapEvents } from 'react-leaflet'
import { Icon } from 'leaflet'
import redMarker from './../media/img/redMarker.png'
import purpleMarker from './../media/img/purpleMarker.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import classes from './styles/LocationMarkers.module.css'
import UserService from '../API/UserService'
import AuthContext from '../context/AuthContext'
import UserContext from '../context/UserContext'
import Loader from './UI/Loader/Loader'
import { Link } from 'react-router-dom'
import CustomButton from './UI/CustomButton/CustomButton'

const LocationMarkers = ({selectedUsers, canAddMarkers, setCanAddMarkers, canDeleteMarkers, popupText}) => {
    const [markers, setMarkers] = useState([]) // create two different states one for sent one for recieved
    const [confirmMarker, setConfirmMarker] = useState(false)
    const [draggable, setDraggable] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const {csrftoken} = useContext(AuthContext)
    const {thisUser} = useContext(UserContext)
    const popupRef = useRef(null)
    

    useEffect(() => {
        setIsLoading(true)
        const getEvents = async () => {
            const sent_events = await UserService.getEvents('sent')
            const recieved_events = await UserService.getEvents('recieved')
            setMarkers([...sent_events, ...recieved_events])
            setIsLoading(false)
        }

        getEvents()
        
    }, [])
    console.log(markers)

    function defineMarker(color){
        const customIcon = new Icon({
          iconUrl: color,
          iconSize: [64, 64]
        })
        return customIcon
    }

    const handleMarkerDrag = (e) => {
        const {lat, lng} = e.target.getLatLng()
        setMarkers(prevMarkers => prevMarkers.map(marker => marker.marker_id === e.target.options.id ? {...marker, latitude: lat, longitude: lng} : marker))
        
    }
    
    const handleMarkerDelete = (e) => {
        if (canDeleteMarkers){
            setMarkers(markers.filter(marker => marker.marker_id !== e.target.options.id))
        }
    }

    const handleMarkerAccept = async (markerID, requester_username) => { // move to mapComp?
        if (thisUser.username === requester_username){
            const marker = markers.find(m => m.marker_id === markerID)
            const data = {
                marker_id: marker.marker_id,
                popup: marker.popup,
                latitude: marker.latitude,
                longitude: marker.longitude,
                recipient_username: selectedUsers,
                requester_username: thisUser.username
            }
            const response = await UserService.sendEvent(data, csrftoken)
            setConfirmMarker(true)
            setDraggable(false)
            console.log(response)
        } else {
            setConfirmMarker(true)
            const response = await UserService.acceptEvent(markerID, csrftoken)
        }
        setMarkers(prevMarkers => prevMarkers.map(marker => marker.marker_id === markerID ? {...marker, is_accepted: true} : marker))
        
    }

    const handleMarkerReject= async (markerID, requester_username) => { // ?? accesptness for someone else?
        if (thisUser.username === requester_username){
            setMarkers(markers.filter(marker => marker.marker_id !== markerID)) // automically set
        } else {
            const response = await UserService.rejectEvent(markerID, csrftoken)
            setMarkers(markers.filter(marker => marker.marker_id !== markerID))
            console.log(response)
        }
        
    }

    const handleCancelEvent = async(markerID) => { // automically set
        const response = await UserService.cancelEvent(markerID, csrftoken)
        console.log(response)
    }


    const map = useMapEvents({
        click(e) {
            if (canAddMarkers){
                const marker = {
                    marker_id: Date.now() + Math.random(),
                    requester_username: thisUser.username,
                    recipient_username: selectedUsers,
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng,
                    icon: defineMarker(purpleMarker),
                    is_accepted: false,
                    popup: popupText || 'See you soon',
                }
                setMarkers(prevMarkers => [...prevMarkers, marker])
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
    isLoading
    ? <Loader />
    :
    <React.Fragment>
        {markers.map(marker =>
        <Marker
            id={marker.marker_id}
            eventHandlers={{dragend: handleMarkerDrag, click: handleMarkerDelete}}
            key={marker.marker_id} position={[marker.latitude, marker.longitude]}
            icon={defineMarker(thisUser.username === marker.requester_username ? purpleMarker : redMarker)}
            draggable={!marker.event_id && draggable}
            >
            <Popup ref={popupRef}>
                {
                ((marker.event_id && !(thisUser.username === marker.requester_username) && !marker.is_accepted) ||
                (!marker.event_id && (thisUser.username === marker.requester_username && !marker.is_accepted))) && // for every user is_accepted
                <div className={classes.choice}> 
                    <FontAwesomeIcon icon={faCheck} style={{color: "#31af40",}} onClick={() => handleMarkerAccept(marker.marker_id, marker.requester_username)}/>
                    <FontAwesomeIcon icon={faXmark} style={{color: "#d72828",}} onClick={() => handleMarkerReject(marker.marker_id, marker.requester_username)}/>
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
                        {marker.recipient_username.map(username => 
                        <span key={username}>
                            {thisUser.username === username
                            ? <strong>You</strong>
                            : <Link to={`/user/${username}`}>{username}</Link>
                            }
                            &nbsp;
                        </span>
                        )}
                    </div>
                    </>
                    }
                    <div className={classes.popup}>
                        <strong>Message: </strong><br/>
                        {marker.popup}
                    </div>
                </div>

                {(thisUser.username === marker.requester_username && marker.is_accepted) &&
                <div className={classes.cancelEventButton}>
                    <CustomButton onClick={() => handleCancelEvent(marker.marker_id)} >Cancel event</CustomButton>
                </div>
                }
            </Popup>
        </Marker>)}
    </React.Fragment>
  )
}

export default LocationMarkers