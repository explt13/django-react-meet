import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import classes from './styles/Map.module.css'
import Loader from './UI/Loader/Loader'
import { FullscreenControl } from 'react-leaflet-fullscreen'
import LocationMarkers from './LocationMarkers'
import { getFullDate } from '../utils/calendarUtil'
import AdditionalControl from './AdditionalControl'
import L, { map } from 'leaflet'




const Map = ({readyToRender, selectedUsers}) => {
  const [minDate, maxDate] = getFullDate()
  const [position, setPosition] = useState(null)
  const [eventInformation, setEventInformation] = useState({text: '', time: minDate})
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [canAddMarkers, setCanAddMarkers] = useState(false)


  useEffect(() => {
    setIsLoading(true)
    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
      (pos) => {
        const {latitude, longitude} = pos.coords
        setPosition([latitude, longitude])
        setIsLoading(false)
      },
      (err) => {
        setError(err)
      })
    }
    getLocation()


  }, [])
  


  return (
    isLoading || error || !readyToRender
    ?
    <Loader />
    :
    <div className={[classes.wrapper, 'container'].join(' ')}> {/* container ?? */}
      <MapContainer id='myMap' center={position} zoom={13} scrollWheelZoom={true} className={classes.map} attributionControl={false}>
        <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FullscreenControl forceSeparateButton={true} content='[ &nbsp&nbsp]'position='topleft'/>
        <LocationMarkers selectedUsers={selectedUsers} canAddMarkers={canAddMarkers} setCanAddMarkers={setCanAddMarkers} eventInformation={eventInformation}/>
      </MapContainer>

      <AdditionalControl
      canAddMarkers={canAddMarkers}
      setCanAddMarkers={setCanAddMarkers}
      setEventInformation={setEventInformation}
      mapID={'myMap'}/>
    </div>
  )
}

export default Map