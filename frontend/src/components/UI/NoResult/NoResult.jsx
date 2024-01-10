import { faFaceSadTear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import classes from './NoResult.module.css'

const NoResult = () => {
  return (
    <div className={classes.container}>
        <div className={classes.icon}><FontAwesomeIcon icon={faFaceSadTear} /></div>
        <div className={classes.text}>Seems empty..</div>
    </div>
  )
}

export default NoResult