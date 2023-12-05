import React, { useEffect, useState } from 'react'
import classes from './styles/AdditionalControl.module.css'
import CustomIcon from './UI/CustomIcon/CustomIcon'
import CustomInput from './UI/CustomInput/CustomInput'
import { faMapMarkerAlt, faTimes} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import L from 'leaflet'


const AdditionalControl = ({canAddMarkers, setCanAddMarkers, canDeleteMarkers, setCanDeleteMarkers, popupText, setPopupText, mapID}) => {
    

    useEffect(() => {
        const map = L.DomUtil.get(mapID)
    
        if (map && canAddMarkers){
          map.classList.add(classes.addMarkerAction)
          setCanDeleteMarkers(false)
    
        } else if (map && !canAddMarkers){
          map.classList.remove(classes.addMarkerAction)
        }
    }, [canAddMarkers])
    

    useEffect(() => {
        const map = L.DomUtil.get(mapID)
    
        if (map && canDeleteMarkers){
          map.classList.add(classes.deleteMarkerAction)
          setCanAddMarkers(false)
    
        } else if (map && !canDeleteMarkers){
          map.classList.remove(classes.deleteMarkerAction)
          
        }
    }, [canDeleteMarkers])


    const handleAddMarker = () =>{
        setCanAddMarkers(!canAddMarkers)
        setPopupText('')
    }
    

    return (
        <div className={classes.additionalControlContainer}>
            <div className={classes.additionalControl}>
                <div className={classes.controlItem} onClick={handleAddMarker}>
                    <CustomIcon>
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                    </CustomIcon>
                </div>
                <div className={classes.controlItem} onClick={() => {setCanDeleteMarkers(!canDeleteMarkers)}} style={{backgroundColor: canDeleteMarkers ? '#eee' : 'transparent'}}>
                    <CustomIcon>
                        <FontAwesomeIcon icon={faTimes} />
                    </CustomIcon>
                </div>
            </div>
            {canAddMarkers && 
            <div className={classes.popupInput}> {/*MAKE MODAL??? */}
                <CustomInput placeholder={'Let\'s have a walk..'} autoFocus={true} value={popupText} onChange={(e) => setPopupText(e.target.value)}/>
            </div>
            }
        </div>
  )
}

export default AdditionalControl