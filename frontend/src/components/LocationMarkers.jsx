import React, { useContext, useEffect, useInsertionEffect, useRef, useState } from 'react'
import { useMapEvents } from 'react-leaflet'
import SentEvents from './SentEvents'
import RecievedEvents from './RecievedEvents'
import MapContext from '../context/MapContext'

const LocationMarkers = () => {
    
    const {canAddMarkers, senderSort} = useContext(MapContext)
    

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
            {senderSort.sent && <SentEvents /> }
            {senderSort.recieved && <RecievedEvents /> }
        </React.Fragment>
  )
}

export default LocationMarkers