import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import UserContext from './UserContext'
import { getDateForInput, getFormattedFullDate } from '../utils/calendarUtil'

const MapContext = createContext(null)

export const MapProvider = ({children}) => {

    const [minDate, maxDate] = getDateForInput()
    const [category, setCategory] = useState('ALL')
    const [friendsSortArray, setFriendsSortArray] = useState([])
    const [position, setPosition] = useState(null)
    const [canAddMarkers, setCanAddMarkers] = useState(false)
    const [eventInformation, setEventInformation] = useState({text: '', date: minDate, time: '', category: '', selectedUsers: []})
    const [mapID, setMapID] = useState('myMap')
    const [modalPopup, setModalPopup] = useState(false)
    const [senderSort, setSenderSort] = useState({sent: true, recieved: true})
    const [acceptedSort, setAcceptedSort] = useState(true)
    const [dateSort, setDateSort] = useState('')
    const [strictSort, setStrictSort] = useState(false)

    

    
    const context = {
        dateSort,
        setDateSort,
        acceptedSort,
        setAcceptedSort,
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