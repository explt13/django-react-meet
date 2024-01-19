import React, { useContext, useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import classes from './styles/Map.module.css'
import LocationMarkers from './LocationMarkers'
import AdditionalControl from './AdditionalControl'
import MapContext from '../context/MapContext'
import EventService from '../API/EventService'
import Modal from './UI/Modal/Modal'
import PopupForm from './PopupForm'
import FullscreenControl from './FullscreenControl'
import UserContext from '../context/UserContext'
import { useLocation } from 'react-router-dom'


const Map = () => {  
  const {position, setEventInformation, minDate, modalPopup, setModalPopup, setCanAddMarkers} = useContext(MapContext)
  const [isMapFullscreen, setIsMapFullscreen] = useState(false)
  const { isMobile } = useContext(UserContext)
  const mapContainerRef = useRef(null)
  
  const cancelAddEvent = () => {
    setModalPopup(false)
    setEventInformation({text: '', date: minDate, time: '', category: '', selectedUsers: []})
    setCanAddMarkers(false)
  }

  useEffect(() => {
    if (isMapFullscreen){
      mapContainerRef.current.requestFullscreen()
    }
    if (document.fullscreenElement && !isMapFullscreen){
      document.exitFullscreen()
    }

  }, [isMapFullscreen, mapContainerRef])

  return (
    <div className={classes.mapContainer} ref={mapContainerRef}>
      <MapContainer id='myMap' center={position} zoom={13} scrollWheelZoom={true} className={classes.map} attributionControl={false} doubleClickZoom={false}>
        <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarkers/>
        {!isMobile && <FullscreenControl setIsMapFullscreen={setIsMapFullscreen} isMapFullscreen={isMapFullscreen} />}
        <AdditionalControl setModalPopup={setModalPopup} />
      </MapContainer>
      <Modal visible={modalPopup} setVisible={setModalPopup} onModalClose={cancelAddEvent}>
        <PopupForm isOpen={modalPopup} setIsOpen={setModalPopup}/>
      </Modal>
    </div>  

  )
}

export default Map