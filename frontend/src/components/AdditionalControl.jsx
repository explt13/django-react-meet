import React, { useContext, useEffect, useState } from 'react'
import classes from './styles/Control.module.css'
import CustomIcon from './UI/CustomIcon/CustomIcon'
import { faExpand, faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import L, { popup } from 'leaflet'
import MapContext from '../context/MapContext'

const AdditionalControl = ({setModalPopup}) => {

    const {canAddMarkers, setCanAddMarkers, mapID, setSort} = useContext(MapContext)
    
    useEffect(() => {
        const map = L.DomUtil.get(mapID)
        const canvas = document.createElement('canvas');
        canvas.width = 30;
        canvas.height = 40;
        const ctx = canvas.getContext("2d");

        if (map && canAddMarkers){    
            ctx.fillStyle = "#6a5bcd"
            ctx.font='24px FontAwesome';
            ctx.fillText("\uf3c5", 0, 30);
            const imgCreated = canvas.toDataURL("image/png");
            map.style.cursor = "url(" + imgCreated + "), auto";

    
        } else if (map && !canAddMarkers){
            map.style.cursor = 'grab'

        }
    }, [canAddMarkers])
    

    const handleAddMarker = () =>{
        setSort({category: 'ALL', friendsArray: [], sent: true, received: true, accepted: false, strict: false, date: ''})
        setCanAddMarkers(true)
        setModalPopup(true)
    }

    return (
        
        <div className={classes.additionalControl}>
            <div className={classes.controlItem} onClick={handleAddMarker}>
                <CustomIcon>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                </CustomIcon>
            </div>
        </div>

  )
}

export default AdditionalControl