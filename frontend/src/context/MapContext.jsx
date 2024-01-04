import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import UserContext from './UserContext'
import { getDateForInput } from '../utils/calendarUtil'

const MapContext = createContext(null)

export const MapProvider = ({children}) => {
    const [minDate, maxDate] = getDateForInput()
    const [category, setCategory] = useState('ALL')
    const [selectedUsers, setSelectedUsers] = useState([])
    const [friendsSort, setFriendsSort] = useState([])
    const [position, setPosition] = useState(null)
    const [canAddMarkers, setCanAddMarkers] = useState(false)
    const [eventInformation, setEventInformation] = useState({text: '', time: minDate, category: 'HEALTH'})
    const [mapID, setMapID] = useState('myMap')
    const [modalPopup, setModalPopup] = useState(false)
    const [senderSort, setSenderSort] = useState({sent: true, recieved: true})
   
    
    const context = {
        friendsSort,
        setFriendsSort,
        senderSort,
        setSenderSort,
        modalPopup,
        setModalPopup,
        minDate,
        maxDate,
        category,
        setCategory,
        selectedUsers,
        setSelectedUsers,
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