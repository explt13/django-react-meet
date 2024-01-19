import React from 'react'
import classes from './Loader.module.css'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Loader = () => {

  return (
    <div className={classes.container}>
        <div className="spinner-border" role="status" style={{width: '45px', height: "45px", fontSize: "20px"}}>
          <span className="visually-hidden">Loading...</span>
        </div>
    </div>
  )
}

export default Loader