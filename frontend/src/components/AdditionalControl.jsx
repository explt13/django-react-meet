import React, { useEffect, useState } from 'react'
import classes from './styles/AdditionalControl.module.css'
import CustomIcon from './UI/CustomIcon/CustomIcon'
import CustomInput from './UI/CustomInput/CustomInput'
import { faMapMarkerAlt, faTimes} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import L, { popup } from 'leaflet'
import Modal from './UI/Modal/Modal'
import PopupForm from './PopupForm'

const AdditionalControl = ({canAddMarkers, setCanAddMarkers, mapID, setEventInformation}) => {
    const [modalPopup, setModalPopup] = useState(false)

    useEffect(() => {
        const map = L.DomUtil.get(mapID)

        if (map && canAddMarkers){
          map.classList.add(classes.addMarkerAction)
    
        } else if (map && !canAddMarkers){
            map.classList.remove(classes.addMarkerAction)
        }
    }, [canAddMarkers])
    


    const handleAddMarker = () =>{
        setCanAddMarkers(true)
        setModalPopup(true)
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
            <Modal visible={modalPopup} setVisible={setModalPopup} block={true}>
                <PopupForm setEventInformation={setEventInformation} isOpen={modalPopup} setIsOpen={setModalPopup} setCanAddMarkers={setCanAddMarkers}/>
            </Modal>
        </div>
  )
}

export default AdditionalControl