import React, { useEffect } from 'react'
import classes from './Footer.module.css'

const Footer = () => {
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.contentItem}>Planpro</div>
        <div className={classes.contentItem}>About</div>
      </div>
    </div>
  )
}

export default Footer