import React, { useContext, useEffect, useState } from 'react'
import MapComp from './../components/MapComp'
import UserContext from '../context/UserContext'
import Loader from '../components/UI/Loader/Loader'
import { useLocation, useParams } from 'react-router-dom'


const MapPage = () => {
    const {isLoading} = useContext(UserContext)
    const [position, setPosition] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!isLoading){
            const timeoutID = setTimeout(() => {
                const getLocation = () => {
                    navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      const {latitude, longitude} = pos.coords
                      setPosition([latitude, longitude])
                    },
                    (err) => {
                      setError(err)
                    })
                  }
                  getLocation()
            }, 10)
    
            return () => clearTimeout(timeoutID)
        }
        
    }, [isLoading])

    return (
        isLoading
        ? <Loader />
        :
        <div className='wrapper container'>
            <MapComp position={position} error={error}/>
        </div>
    )
}

export default MapPage