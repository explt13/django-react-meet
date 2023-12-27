import React, { useContext, useEffect, useState } from 'react'
import MapComp from './../components/MapComp'
import UserContext from '../context/UserContext'
import Loader from '../components/UI/Loader/Loader'
import { useLocation, useParams } from 'react-router-dom'
import MapContext, { MapProvider } from '../context/MapContext'


const MapPage = () => {

    return (
        <MapProvider>
            <div className='wrapper container' >
                <MapComp />
            </div>
        </MapProvider>
    )
}

export default MapPage