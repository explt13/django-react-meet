import { faFaceSadTear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import classes from './NoResult.module.css'

const NoResult = ({data, icon, iconStyles}) => {
  return (
    <div className={classes.container}>
        <div className={[iconStyles, classes.icon].join(' ')}>{icon}</div>
        <div className={classes.text}>{data}</div>
    </div>
  )
}

export default NoResult