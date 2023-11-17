import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Icon } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMapEvents, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import classes from '../styles/Map.module.css'
import redMarker from './../media/img/redMarker.png'
import purpleMarker from './../media/img/purpleMarker.png'
import Loader from './UI/Loader/Loader'
import { FullscreenControl } from 'react-leaflet-fullscreen'
import CustomIcon from './UI/CustomIcon/CustomIcon'
import { faExpand } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Map = ({readyToRender}) => {
  const [position, setPosition] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
      (pos) => {
        const {latitude, longitude} = pos.coords
        setPosition({latitude, longitude})
        setIsLoading(false)
      },
      (err) => {
        setError(err)
      })
    }
    getLocation()


    
  }, [])

  
  function defineMarker(color){
    const customIcon = new Icon({
      iconUrl: color,
      iconSize: [64, 64]
    })
    return customIcon
  }
  const currentCoords = isLoading || !position ? [0, 0] : [position.latitude, position.longitude]
  const markers = [
    {position: currentCoords, popup: 'you are here', icon: defineMarker(purpleMarker), draggable: true},
    {position: [53.2, -3.9], popup: '1st marker', icon: defineMarker(redMarker)},
    {position: [53, -3.5], popup: '2nd marker', icon: defineMarker(redMarker)}
  ]



  return (
    isLoading || error || !readyToRender
    ?
    <Loader />
    :
    <div className={[classes.wrapper, 'container'].join(' ')}>
      <MapContainer  center={currentCoords} zoom={13} scrollWheelZoom={false} className={classes.map} attributionControl={false}>
        <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FullscreenControl forceSeparateButton={true} content='[ &nbsp&nbsp]'position='topleft'/>
        {markers.map((marker, index) => (
          <Marker  key={index} position={marker.position} icon={marker.icon} draggable={marker.draggable}>
            <Popup>
              {marker.popup}
            </Popup>  
          </Marker>
        ))}
        <Polyline pathOptions={{color: 'green'}} positions={[currentCoords, [53, -3.5]]} />
        
      </MapContainer>
    </div>
  )
}

export default Map