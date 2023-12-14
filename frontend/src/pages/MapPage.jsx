import React, { useEffect, useState } from 'react'
import MapComp from './../components/MapComp'


const MapPage = () => {
    const [readyToRender, setReadyToRender] = useState(false)

    useEffect(() => {
        const timeoutID = setTimeout(() => {
            setReadyToRender(true)
        }, 0)

        return () => clearTimeout(timeoutID)
    }, [])

    return (
        <div className='wrapper container'>
            <MapComp readyToRender={readyToRender}/>
        </div>
    )
}

export default MapPage