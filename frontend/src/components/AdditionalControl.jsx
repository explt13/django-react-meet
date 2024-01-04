import React, { useContext, useEffect, useState } from 'react'
import classes from './styles/AdditionalControl.module.css'
import CustomIcon from './UI/CustomIcon/CustomIcon'
import CustomInput from './UI/CustomInput/CustomInput'
import { faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import L, { popup } from 'leaflet'
import Modal from './UI/Modal/Modal'
import PopupForm from './PopupForm'
import MapContext from '../context/MapContext'

const AdditionalControl = () => {
    const {modalPopup, setModalPopup} = useContext(MapContext)
    const {canAddMarkers, setCanAddMarkers, mapID, setEventInformation, minDate, setSenderSort} = useContext(MapContext)

    
    useEffect(() => {
        const map = L.DomUtil.get(mapID)

        if (map && canAddMarkers){
          map.classList.add(classes.addMarkerAction)
    
        } else if (map && !canAddMarkers){
            map.classList.remove(classes.addMarkerAction)
        }
    }, [canAddMarkers])
    

    const cancelAddEvent = () => {
        setModalPopup(false)
        setEventInformation({text: '', time: minDate, category: 'HEALTH'})
        setCanAddMarkers(false)
    }

    const handleAddMarker = () =>{
        setCanAddMarkers(true)
        setModalPopup(true)
        setSenderSort(prevSort => ({...prevSort, sent: true}))
    }
    return (
        <div className={classes.additionalControlContainer}>
            <div className={classes.additionalControl}>
                <div className={classes.controlItem} onClick={handleAddMarker}>
                    <CustomIcon>
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                    </CustomIcon>
                </div>
            </div>
            <Modal visible={modalPopup} setVisible={setModalPopup} onModalClose={cancelAddEvent}>
                <PopupForm isOpen={modalPopup} setIsOpen={setModalPopup}/>
            </Modal>
        </div>
  )
}

export default AdditionalControl