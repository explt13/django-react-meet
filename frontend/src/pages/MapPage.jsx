import React, { useContext, useEffect, useState } from 'react'
import MapComp from './../components/MapComp'
import UserContext from '../context/UserContext'
import Loader from '../components/UI/Loader/Loader'
import { useLocation, useParams } from 'react-router-dom'
import MapContext, { MapProvider } from '../context/MapContext'


const MapPage = () => {
    const { state }= useLocation() // get state from navigate
    return (
        <MapProvider>
            <div className='wrapper container' >
                <MapComp state={state}/>
            </div>
        </MapProvider>
    )
}

export default MapPage