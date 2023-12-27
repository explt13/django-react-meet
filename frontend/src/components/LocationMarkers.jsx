import React, { useContext, useEffect, useInsertionEffect, useRef, useState } from 'react'
import { useMapEvents } from 'react-leaflet'
import SentEvents from './SentEvents'
import RecievedEvents from './RecievedEvents'
import MapContext from '../context/MapContext'

const LocationMarkers = () => {
    
    const {canAddMarkers} = useContext(MapContext)
    const eventMarkers  = [
      {category: 'HEALTH', icon: '<i class="fas fa-plus-square"></i>', className: 'health'},
      {category: 'EDUCATION', icon: '<i class="fa-solid fa-graduation-cap"></i>', className: 'education'},
      {category: 'DINNER', icon: '<i class="fa-solid fa-mug-hot"></i>', className: 'dinner'},
      {category: 'BAR', icon: '<i class="fa-solid fa-wine-glass"></i>', className: 'bar'},
      {category: 'LEISURE', icon: '<i class="fa-solid fa-baseball-bat-ball"></i>', className: 'leisure'},
      {category: 'RELAXATION', icon: '<i class="fa-solid fa-mountain-sun"></i>', className: 'relaxation'},
      {category: 'HOLIDAY', icon: '<i class="fa-solid fa-snowman"></i>', className: 'holiday'},
      {category: 'WORK', icon: '<i class="fa-solid fa-briefcase"></i>', className: 'work'},
      {category: 'TRAVEL', icon: '<i class="fa-solid fa-car"></i>', className: 'travel'},
      {category: 'SHOPING', icon: '<i class="fa-solid fa-bag-shopping"></i>', className: 'shoping'}
    ]

    const map = useMapEvents({
        dblclick() {
            if (!canAddMarkers){
                map.locate()
            }       
        },
        locationfound(e){
            map.flyTo(e.latlng, 13)
        }
        
    })

  return (
    <React.Fragment>
        <SentEvents />
        <RecievedEvents />
    </React.Fragment>
  )
}

export default LocationMarkers