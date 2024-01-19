import React, { useContext, useEffect, useState } from 'react'
import MapComp from './../components/MapComp'
import UserContext from '../context/UserContext'
import Loader from '../components/UI/Loader/Loader'
import { useLocation, useParams } from 'react-router-dom'
import MapContext, { MapProvider } from '../context/MapContext'
import EventService from '../API/EventService'


const MapPage = () => {
    const { state } = useLocation() // get state from navigate
    const { isMobile, setReceivedEvents, setSentEvents } = useContext(UserContext)
    const [isRefreshed, setIsRefrehsed] = useState(false)
    
    useEffect(() => {
        const refreshEvents = async () => {
            await EventService.refreshEvents()
            const sent_events = await EventService.getSentEvents()
            const received_events = await EventService.getReceivedEvents()
            setSentEvents([...sent_events])
            setReceivedEvents([...received_events])
            setIsRefrehsed(true)
        }
        refreshEvents()  
    }, [])


    return (
        <MapProvider>
            <div className={isMobile ? '' :'container contentWrapper' }>
                <MapComp state={state}/>
            </div>
        </MapProvider>
    )
}

export default MapPage