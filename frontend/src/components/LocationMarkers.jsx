import React, { useContext, useEffect, useInsertionEffect, useRef, useState } from 'react'
import { useMapEvents } from 'react-leaflet'
import SentEvents from './SentEvents'
import ReceivedEvents from './ReceivedEvents'
import MapContext from '../context/MapContext'

const LocationMarkers = () => {
    
    const {canAddMarkers, sort} = useContext(MapContext)
    

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
            {sort.sent && <SentEvents /> }
            {sort.received && <ReceivedEvents /> }
        </React.Fragment>
  )
}

export default LocationMarkers