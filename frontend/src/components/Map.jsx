import React, { useContext, useEffect, useState } from 'react'
import { MapContainer, TileLayer} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import classes from './styles/Map.module.css'
import Loader from './UI/Loader/Loader'
import { FullscreenControl } from 'react-leaflet-fullscreen'
import LocationMarkers from './LocationMarkers'
import { getFullDate } from '../utils/calendarUtil'
import AdditionalControl from './AdditionalControl'
import L, { map } from 'leaflet'
import MapContext from '../context/MapContext'




const Map = () => {  
  const {position} = useContext(MapContext)

  return (
    !position
    ?
    <Loader /> // error
    :
    <div className={[classes.wrapper, 'container'].join(' ')}> {/* container ?? */}
      <MapContainer id='myMap' center={position} zoom={13} scrollWheelZoom={true} className={classes.map} attributionControl={false} doubleClickZoom={false}>
        <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FullscreenControl forceSeparateButton={true} content='[ &nbsp&nbsp]'position='topleft'/>
        <LocationMarkers/>
      </MapContainer>
      <AdditionalControl/>
      
    </div>
  )
}

export default Map