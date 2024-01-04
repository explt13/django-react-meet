import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import UserContext from './UserContext'
import { getDateForInput } from '../utils/calendarUtil'

const MapContext = createContext(null)

export const MapProvider = ({children}) => {
    const [minDate, maxDate] = getDateForInput()
    const [category, setCategory] = useState('ALL')
    const [friendsSortArray, setFriendsSortArray] = useState([])
    const [position, setPosition] = useState(null)
    const [canAddMarkers, setCanAddMarkers] = useState(false)
    const [eventInformation, setEventInformation] = useState({text: '', time: minDate, category: 'HEALTH', selectedUsers: []})
    const [mapID, setMapID] = useState('myMap')
    const [modalPopup, setModalPopup] = useState(false)
    const [senderSort, setSenderSort] = useState({sent: true, recieved: true})
    const [strictSort, setStrictSort] = useState(false)
   
    
    const context = {
        strictSort,
        setStrictSort,
        friendsSortArray,
        setFriendsSortArray,
        senderSort,
        setSenderSort,
        modalPopup,
        setModalPopup,
        minDate,
        maxDate,
        category,
        setCategory,
        position,
        setPosition,
        canAddMarkers,
        setCanAddMarkers,
        eventInformation,
        setEventInformation,
        mapID,
        setMapID
    }
    return (
        <MapContext.Provider value={context}>
            {children}
        </MapContext.Provider>
    )
}

export default MapContext