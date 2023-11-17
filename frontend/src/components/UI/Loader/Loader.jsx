import React from 'react'
import classes from './Loader.module.css'

const Loader = () => {

  return (
    <div className={classes.container}>
        <div className="spinner-grow" style={{width: '5rem', height: '5rem'}} role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
  )
}

export default Loader