import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import UserContext from './UserContext'
import { getDateForInput, getFormattedFullDate } from '../utils/calendarUtil'

const MapContext = createContext(null)

export const MapProvider = ({children}) => {
    const [minDate, maxDate] = getDateForInput()
    const [position, setPosition] = useState(null)
    const [canAddMarkers, setCanAddMarkers] = useState(false)
    const [eventInformation, setEventInformation] = useState({text: '', date: minDate, time: '', category: '', selectedUsers: []})
    const [mapID, setMapID] = useState('myMap')
    const [modalPopup, setModalPopup] = useState(false)
    const [sort, setSort] = useState({category: 'ALL', friendsArray: [], sent: true, received: true, accepted: false, strict: false, date: ''})

    const context = {
        sort,
        setSort,
        modalPopup,
        setModalPopup,
        minDate,
        maxDate,
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