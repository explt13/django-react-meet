import React, { useEffect, useState } from 'react'
import classes from './Alert.module.css'
const Alert = ({alert, setAlert}) => {
    const [rootClasses, setRootClasses] = useState([classes.alertContainer])
    const [statusClass, setStatusClass] = useState(null)
    
    useEffect(() => {
        if (alert.text){ // if there is alert

            if (alert.status >= 100 && alert.status < 300){
                setStatusClass(classes.success)
            } 
            if (alert.status >= 300 && alert.status < 400){
                setStatusClass(classes.redirect)
            }
            if (alert.status >= 400 && alert.status < 500){
                setStatusClass(classes.error)
            }
            
            setRootClasses(prevClasses => [...prevClasses, classes.active])
            setTimeout(() => {
                setRootClasses(prevClasses => [...prevClasses, classes.closing])
                setTimeout(() => {
                    setRootClasses([classes.alertContainer])
                    setAlert && setAlert({status: null, text: null})
                }, 500)
            }, 1500)
            
        }
    }, [alert])
    return (
        <div className={rootClasses.join(' ')}>
            <div className={[classes.alertContent, statusClass].join(' ')}>{alert.text}</div>
        </div>
    )
}

export default Alert