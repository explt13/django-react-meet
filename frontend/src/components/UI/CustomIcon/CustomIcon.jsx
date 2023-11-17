import React from 'react'
import classes from './CustomIcon.module.css'

const CustomIcon = ({children, ...props}) => {
  return (
    <i className={classes.icon}>
        {children}
    </i>
  )
}

export default CustomIcon