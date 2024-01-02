import React from 'react'
import classes from './styles/ErrorPage.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFaceFrownOpen, faSadTear } from '@fortawesome/free-solid-svg-icons'

const ErrorPage = () => {
  return (
    <div className={classes.container}>
        <div className={classes.errorIcon}><FontAwesomeIcon icon={faSadTear} /></div>
        <div className={classes.errorText}>404 not found</div>
    </div>
  )
}

export default ErrorPage