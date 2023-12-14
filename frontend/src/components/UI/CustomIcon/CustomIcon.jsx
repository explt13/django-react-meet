import React from 'react'
import classes from './CustomIcon.module.css'

const CustomIcon = ({children, className, ...props}) => {
  return (
    <i {...props} className={[className, classes.icon].join(' ')}>
        {children}
    </i>
  )
}

export default CustomIcon